import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Activity, Loader2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

interface Biometric {
    id: number;
    recorded_at: string;
    type: string;
    value: number | null;
    unit: string | null;
    notes: string | null;
}

interface Props {
    biometrics: {
        data: Biometric[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Biometrics', href: '/biometrics' },
];

export default function BiometricsIndex({ biometrics }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        recorded_at: new Date().toISOString().slice(0, 10),
        type: 'sleep',
        value: '',
        unit: 'hours',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/biometrics', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Biometrics Tracking" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Biometrics</h1>
                    <p className="mt-2 text-muted-foreground">Track sleep, weight, heart rate, and more</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Log Biometric Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="recorded_at">Date</Label>
                                        <Input
                                            id="recorded_at"
                                            type="date"
                                            value={data.recorded_at}
                                            onChange={(e) => setData('recorded_at', e.target.value)}
                                            required
                                        />
                                        {errors.recorded_at && <p className="text-sm text-destructive">{errors.recorded_at}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sleep">Sleep</SelectItem>
                                                <SelectItem value="weight">Weight</SelectItem>
                                                <SelectItem value="heart_rate">Heart Rate</SelectItem>
                                                <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                                                <SelectItem value="body_temperature">Body Temperature</SelectItem>
                                                <SelectItem value="blood_glucose">Blood Glucose</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Value</Label>
                                        <Input
                                            id="value"
                                            type="number"
                                            step="0.01"
                                            value={data.value}
                                            onChange={(e) => setData('value', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.value && <p className="text-sm text-destructive">{errors.value}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unit">Unit</Label>
                                        <Input
                                            id="unit"
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            placeholder="e.g., hours, kg, bpm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Additional notes..."
                                        rows={3}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log Data
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {biometrics.data.map((entry) => (
                                    <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <p className="font-medium capitalize">{entry.type.replace('_', ' ')}</p>
                                            <p className="text-sm text-muted-foreground">{entry.recorded_at}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">
                                                {entry.value} {entry.unit}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {biometrics.data.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No biometric data yet. Start logging!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
