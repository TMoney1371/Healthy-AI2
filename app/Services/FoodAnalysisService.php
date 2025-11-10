<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class FoodAnalysisService
{
    public function analyzeFood(string $imagePath): array
    {
        $apiKey = config('services.openai.api_key');
        
        if (!$apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }
        
        // Get full path to image
        $fullPath = Storage::disk('public')->path($imagePath);
        
        // Convert image to base64
        $imageData = base64_encode(file_get_contents($fullPath));
        $mimeType = mime_content_type($fullPath);
        
        // Call OpenAI Vision API directly via HTTP
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => 'Analyze this food image and provide nutritional estimates. Return ONLY a JSON object with this exact structure (no markdown, no explanation): {"calories": number, "protein": number, "carbs": number, "fat": number, "confidence": 0-1, "items": ["item1", "item2"], "description": "brief description"}'
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => "data:{$mimeType};base64,{$imageData}",
                            ],
                        ],
                    ],
                ],
            ],
            'max_tokens' => 500,
        ]);

        if (!$response->successful()) {
            throw new \Exception('OpenAI API request failed: ' . $response->body());
        }

        $result = $response->json();
        $content = $result['choices'][0]['message']['content'] ?? '';
        
        // Extract JSON from response (in case GPT adds markdown)
        if (preg_match('/\{.*\}/s', $content, $matches)) {
            $jsonData = json_decode($matches[0], true);
            
            if ($jsonData) {
                return [
                    'estimated_calories' => $jsonData['calories'] ?? null,
                    'estimated_protein' => $jsonData['protein'] ?? null,
                    'estimated_carbs' => $jsonData['carbs'] ?? null,
                    'estimated_fat' => $jsonData['fat'] ?? null,
                    'confidence' => $jsonData['confidence'] ?? 0.5,
                    'detected_items' => $jsonData['items'] ?? [],
                    'description' => $jsonData['description'] ?? '',
                ];
            }
        }

        // Fallback if parsing fails
        return [
            'estimated_calories' => null,
            'estimated_protein' => null,
            'estimated_carbs' => null,
            'estimated_fat' => null,
            'confidence' => 0,
            'detected_items' => [],
            'description' => 'Unable to analyze image',
            'error' => 'Failed to parse AI response',
        ];
    }
}
