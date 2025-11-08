<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AppleHealthImportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('apple-health/import');
    }

    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xml,zip,html|max:512000', // 500MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('apple-health-imports', 'local');

        try {
            $stats = $this->processAppleHealthExport($path, $request->user());

            // Clean up the uploaded file
            Storage::disk('local')->delete($path);

            return redirect()->back()->with('success', "Successfully imported {$stats['total']} health records!");
        } catch (\Exception $e) {
            Storage::disk('local')->delete($path);
            return redirect()->back()->with('error', 'Failed to import Apple Health data: ' . $e->getMessage());
        }
    }

    private function processAppleHealthExport(string $path, $user): array
    {
        $fullPath = Storage::disk('local')->path($path);
        $stats = [
            'biometrics' => 0,
            'exercises' => 0,
            'total' => 0,
        ];

        // Check if it's a ZIP file
        if (pathinfo($fullPath, PATHINFO_EXTENSION) === 'zip') {
            $zip = new \ZipArchive();
            if ($zip->open($fullPath) === true) {
                // Try XML first (old format)
                $exportXml = $zip->getFromName('apple_health_export/export.xml');
                
                // Try HTML if no XML (new format)
                $exportHtml = null;
                if (!$exportXml) {
                    $exportHtml = $zip->getFromName('apple_health_export/export.html');
                }
                
                $zip->close();
                
                if ($exportXml) {
                    $tempXmlPath = sys_get_temp_dir() . '/export_' . uniqid() . '.xml';
                    file_put_contents($tempXmlPath, $exportXml);
                    $stats = $this->parseAppleHealthXML($tempXmlPath, $user);
                    unlink($tempXmlPath);
                } elseif ($exportHtml) {
                    $tempHtmlPath = sys_get_temp_dir() . '/export_' . uniqid() . '.html';
                    file_put_contents($tempHtmlPath, $exportHtml);
                    $stats = $this->parseAppleHealthHTML($tempHtmlPath, $user);
                    unlink($tempHtmlPath);
                } else {
                    throw new \Exception('No export.xml or export.html found in ZIP file. Please ensure you exported from the Health app.');
                }
            }
        } elseif (pathinfo($fullPath, PATHINFO_EXTENSION) === 'html') {
            // Direct HTML file (new format)
            $stats = $this->parseAppleHealthHTML($fullPath, $user);
        } else {
            // Direct XML file (old format)
            $stats = $this->parseAppleHealthXML($fullPath, $user);
        }

        return $stats;
    }

    private function parseAppleHealthXML(string $xmlPath, $user): array
    {
        $stats = [
            'biometrics' => 0,
            'exercises' => 0,
            'total' => 0,
        ];

        $xml = simplexml_load_file($xmlPath);
        if (!$xml) {
            throw new \Exception('Invalid XML file');
        }

        DB::beginTransaction();
        try {
            // Parse biometric records (sleep, heart rate, weight, etc.)
            foreach ($xml->Record as $record) {
                $type = (string) $record['type'];
                $value = (string) $record['value'];
                $unit = (string) $record['unit'];
                $startDate = (string) $record['startDate'];
                $endDate = (string) $record['endDate'];

                // Map Apple Health types to our types
                $mappedType = $this->mapAppleHealthType($type);
                
                if ($mappedType && $value) {
                    $recordedAt = date('Y-m-d', strtotime($startDate));
                    
                    $user->biometrics()->updateOrCreate(
                        [
                            'type' => $mappedType,
                            'recorded_at' => $recordedAt,
                        ],
                        [
                            'value' => $this->convertValue($value, $unit, $mappedType),
                            'unit' => $this->mapUnit($unit, $mappedType),
                            'metadata' => [
                                'source' => 'apple_health_import',
                                'original_type' => $type,
                                'start_date' => $startDate,
                                'end_date' => $endDate,
                                'imported_at' => now(),
                            ],
                        ]
                    );
                    $stats['biometrics']++;
                }
            }

            // Parse workout records
            foreach ($xml->Workout as $workout) {
                $workoutType = (string) $workout['workoutActivityType'];
                $duration = (string) $workout['duration'];
                $calories = (string) $workout['totalEnergyBurned'];
                $distance = (string) $workout['totalDistance'];
                $startDate = (string) $workout['startDate'];

                $mappedExerciseType = $this->mapWorkoutType($workoutType);
                
                $user->exercises()->updateOrCreate(
                    [
                        'date' => date('Y-m-d', strtotime($startDate)),
                        'type' => $mappedExerciseType,
                        'source' => 'apple_health_import',
                    ],
                    [
                        'duration' => $duration ? round($duration / 60) : null, // Convert to minutes
                        'calories' => $calories ? round($calories) : null,
                        'distance' => $distance ? round($distance, 2) : null,
                        'apple_watch_data' => [
                            'original_type' => $workoutType,
                            'start_date' => $startDate,
                            'imported_at' => now(),
                        ],
                    ]
                );
                $stats['exercises']++;
            }

            $stats['total'] = $stats['biometrics'] + $stats['exercises'];
            DB::commit();

            return $stats;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function mapAppleHealthType(string $appleType): ?string
    {
        $mapping = [
            'HKQuantityTypeIdentifierSleepAnalysis' => 'sleep',
            'HKQuantityTypeIdentifierHeartRate' => 'heart_rate',
            'HKQuantityTypeIdentifierBodyMass' => 'weight',
            'HKQuantityTypeIdentifierBloodPressureSystolic' => 'blood_pressure',
            'HKQuantityTypeIdentifierBloodPressureDiastolic' => 'blood_pressure',
            'HKQuantityTypeIdentifierBodyTemperature' => 'body_temperature',
            'HKQuantityTypeIdentifierBloodGlucose' => 'blood_glucose',
            'HKQuantityTypeIdentifierOxygenSaturation' => 'spo2',
            'HKQuantityTypeIdentifierRestingHeartRate' => 'heart_rate',
        ];

        return $mapping[$appleType] ?? null;
    }

    private function mapWorkoutType(string $workoutType): string
    {
        $mapping = [
            'HKWorkoutActivityTypeRunning' => 'running',
            'HKWorkoutActivityTypeCycling' => 'cycling',
            'HKWorkoutActivityTypeSwimming' => 'swimming',
            'HKWorkoutActivityTypeWalking' => 'walking',
            'HKWorkoutActivityTypeTraditionalStrengthTraining' => 'strength',
            'HKWorkoutActivityTypeYoga' => 'yoga',
            'HKWorkoutActivityTypeHighIntensityIntervalTraining' => 'hiit',
        ];

        return $mapping[$workoutType] ?? strtolower(str_replace('HKWorkoutActivityType', '', $workoutType));
    }

    private function convertValue(string $value, string $unit, string $type): float
    {
        $floatValue = (float) $value;

        // Convert units if needed
        if ($type === 'weight' && $unit === 'lb') {
            return round($floatValue * 0.453592, 2); // Convert lbs to kg
        }

        return $floatValue;
    }

    private function mapUnit(string $unit, string $type): string
    {
        $unitMapping = [
            'sleep' => 'hours',
            'heart_rate' => 'bpm',
            'weight' => 'kg',
            'blood_pressure' => 'mmHg',
            'body_temperature' => '°C',
            'blood_glucose' => 'mg/dL',
            'spo2' => '%',
        ];

        return $unitMapping[$type] ?? $unit;
    }

    private function parseAppleHealthHTML(string $htmlPath, $user): array
    {
        $stats = [
            'biometrics' => 0,
            'exercises' => 0,
            'total' => 0,
        ];

        // Load HTML content
        $htmlContent = file_get_contents($htmlPath);
        
        // Apple Health HTML exports contain embedded JSON data
        // Look for the data in script tags or JSON sections
        if (preg_match('/<script[^>]*>.*?var healthData = ({.*?});.*?<\/script>/s', $htmlContent, $matches)) {
            $jsonData = $matches[1];
            $data = json_decode($jsonData, true);
            
            // Process the JSON data similar to XML parsing
            // This is a placeholder - we'll need to see the actual HTML structure
        }
        
        // Alternative: Parse HTML tables directly
        // The HTML format contains tables with health data
        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();
        $dom->loadHTML($htmlContent);
        libxml_clear_errors();
        
        $xpath = new \DOMXPath($dom);
        
        DB::beginTransaction();
        try {
            // Look for health records in table rows
            // Format: Date | Type | Value | Unit
            $rows = $xpath->query('//table//tr[td]');
            
            foreach ($rows as $row) {
                $cells = $xpath->query('.//td', $row);
                if ($cells->length >= 4) {
                    $date = trim($cells->item(0)->textContent ?? '');
                    $type = trim($cells->item(1)->textContent ?? '');
                    $value = trim($cells->item(2)->textContent ?? '');
                    $unit = trim($cells->item(3)->textContent ?? '');
                    
                    if ($date && $type && $value) {
                        // Map type to our format
                        $mappedType = $this->mapHTMLType($type);
                        
                        if ($mappedType) {
                            $recordedAt = date('Y-m-d', strtotime($date));
                            
                            $user->biometrics()->updateOrCreate(
                                [
                                    'type' => $mappedType,
                                    'recorded_at' => $recordedAt,
                                ],
                                [
                                    'value' => (float) preg_replace('/[^0-9.]/', '', $value),
                                    'unit' => $this->mapUnit($unit, $mappedType),
                                    'metadata' => [
                                        'source' => 'apple_health_html_import',
                                        'original_type' => $type,
                                        'imported_at' => now(),
                                    ],
                                ]
                            );
                            $stats['biometrics']++;
                        }
                    }
                }
            }
            
            $stats['total'] = $stats['biometrics'] + $stats['exercises'];
            DB::commit();
            
            return $stats;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to parse HTML export: ' . $e->getMessage());
        }
    }

    private function mapHTMLType(string $htmlType): ?string
    {
        // Map HTML display names to our database types
        $mapping = [
            'Sleep Analysis' => 'sleep',
            'Heart Rate' => 'heart_rate',
            'Resting Heart Rate' => 'heart_rate',
            'Body Mass' => 'weight',
            'Weight' => 'weight',
            'Blood Pressure Systolic' => 'blood_pressure',
            'Blood Pressure Diastolic' => 'blood_pressure',
            'Body Temperature' => 'body_temperature',
            'Blood Glucose' => 'blood_glucose',
            'Oxygen Saturation' => 'spo2',
        ];

        return $mapping[$htmlType] ?? null;
    }
}
