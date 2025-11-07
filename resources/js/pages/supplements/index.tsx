import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pill } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

interface Supplement {
    id: number;
    taken_at: string;
    name: string;
    dosage: string | null;
    unit: string | null;
}

interface Props {
    supplements: {
        data: Supplement[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Supplements', href: '/supplements' },
];

export default function SupplementsIndex({ supplements }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        taken_at: new Date().toISOString().slice(0, 16),
        name: '',
        dosage: '',
        unit: 'mg',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/supplements', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplements" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Supplements</h1>
                    <p className="mt-2 text-muted-foreground">Track vitamins and supplements</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Pill className="h-5 w-5" />
                                Log Supplement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="taken_at">Date & Time</Label>
                                    <Input
                                        id="taken_at"
                                        type="datetime-local"
                                        value={data.taken_at}
                                        onChange={(e) => setData('taken_at', e.target.value)}
                                        required
                                    />
                                    {errors.taken_at && <p className="text-sm text-destructive">{errors.taken_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Supplement Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Vitamin D3, Omega-3"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="dosage">Dosage</Label>
                                        <Input
                                            id="dosage"
                                            value={data.dosage}
                                            onChange={(e) => setData('dosage', e.target.value)}
                                            placeholder="1000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unit">Unit</Label>
                                        <Input
                                            id="unit"
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            placeholder="mg, IU, tablets"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="With food, morning routine, etc..."
                                        rows={3}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log Supplement
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
                                {supplements.data.map((supplement) => (
                                    <div key={supplement.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <p className="font-medium">{supplement.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(supplement.taken_at).toLocaleDateString()} at{' '}
                                                {new Date(supplement.taken_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {supplement.dosage} {supplement.unit}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {supplements.data.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No supplements logged yet. Start tracking!
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
