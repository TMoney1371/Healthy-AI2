import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Apple, FileUp, Info, Upload } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Apple Health Import', href: '/apple-health/import' },
];

export default function AppleHealthImport() {
    const [dragActive, setDragActive] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/apple-health/import', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Apple Health Data" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Import Apple Health Data</h1>
                    <p className="mt-2 text-muted-foreground">
                        Upload your Apple Health export to sync all your health data
                    </p>
                </div>

                {/* Instructions */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>How to Export from Apple Health</AlertTitle>
                    <AlertDescription>
                        <ol className="mt-2 list-inside list-decimal space-y-2 text-sm">
                            <li>Open the <strong>Health app</strong> on your iPhone</li>
                            <li>Tap your <strong>profile picture</strong> in the top right</li>
                            <li>Scroll down and tap <strong>Export All Health Data</strong></li>
                            <li>Tap <strong>Export</strong> to confirm (this may take a few minutes)</li>
                            <li>
                                <strong>For large files (over 20MB):</strong> In Files app, extract the ZIP, 
                                open the <strong>apple_health_export</strong> folder, 
                                then upload the <strong>export.xml</strong> file
                            </li>
                            <li>Otherwise, upload the whole ZIP file here</li>
                        </ol>
                    </AlertDescription>
                </Alert>

                {/* File Size Tip */}
                <Alert className="border-blue-500/50 bg-blue-500/5">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Large File? (Over 500MB or slow upload)</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p className="text-sm">
                            If your file is over 500MB or taking too long, use our Python filter script:
                        </p>
                        <ol className="ml-4 list-inside list-decimal space-y-1 text-sm">
                            <li>Download the script from <strong>GitHub → FILTER_APPLE_HEALTH.md</strong></li>
                            <li>Run: <code className="rounded bg-background px-1">python filter_health_data.py export.xml 90</code></li>
                            <li>This shrinks 3GB files down to ~10MB (last 90 days)</li>
                            <li>Upload the filtered file</li>
                        </ol>
                        <p className="mt-2 text-sm font-medium">
                            💡 Tip: Start with 30 days for fastest upload, then import more later!
                        </p>
                    </AlertDescription>
                </Alert>

                {/* Upload Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Apple className="h-5 w-5" />
                            Upload Health Export
                        </CardTitle>
                        <CardDescription>
                            Drag and drop your export.zip, export.xml, or export.html file (max 500MB)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Drag and Drop Area */}
                            <div
                                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                                    dragActive
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".html,.xml,.zip"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                
                                {data.file ? (
                                    <div className="text-center">
                                        <FileUp className="mx-auto mb-4 h-12 w-12 text-primary" />
                                        <p className="mb-2 font-medium">{data.file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(data.file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <label htmlFor="file-upload">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                Choose Different File
                                            </Button>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="mb-2 font-medium">Drop your export.zip file here</p>
                                        <p className="mb-4 text-sm text-muted-foreground">or</p>
                                        <label htmlFor="file-upload">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                Browse Files
                                            </Button>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {errors.file && (
                                <p className="text-sm text-destructive">{errors.file}</p>
                            )}

                            {/* Upload Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!data.file || processing}
                            >
                                {processing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Apple className="mr-2 h-4 w-4" />
                                        Import Apple Health Data
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* What Gets Imported */}
                <Card>
                    <CardHeader>
                        <CardTitle>What Gets Imported</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 font-semibold">Biometric Data:</h3>
                                <ul className="grid gap-2 text-sm md:grid-cols-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Sleep Duration
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Heart Rate
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Body Weight
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Blood Pressure
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Body Temperature
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Blood Glucose
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        Oxygen Saturation
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">Workouts & Exercise:</h3>
                                <ul className="grid gap-2 text-sm md:grid-cols-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Running
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Cycling
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Swimming
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Walking
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Strength Training
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        Yoga
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        HIIT
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        All Other Workouts
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <Alert className="mt-6">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <strong>Note:</strong> The import process may take a few minutes for large files.
                                Your data is processed securely and the uploaded file is deleted after import.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
