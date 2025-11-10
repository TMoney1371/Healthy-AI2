import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Apple, Loader2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

interface Exercise {
    id: number;
    date: string;
    type: string;
    duration: number | null;
    calories: number | null;
    distance: number | null;
    source: string;
}

interface Props {
    exercises: {
        data: Exercise[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Exercises', href: '/exercises' },
];

export default function ExercisesIndex({ exercises }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toISOString().slice(0, 10),
        type: 'running',
        duration: '',
        calories: '',
        distance: '',
        heart_rate_avg: '',
        source: 'manual',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/exercises', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exercise Tracking" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exercise & Activity</h1>
                    <p className="mt-2 text-muted-foreground">Log workouts and sync with Apple Watch</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Apple className="h-5 w-5" />
                                Log Exercise
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            required
                                        />
                                        {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Exercise Type</Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="running">Running</SelectItem>
                                                <SelectItem value="cycling">Cycling</SelectItem>
                                                <SelectItem value="swimming">Swimming</SelectItem>
                                                <SelectItem value="strength">Strength Training</SelectItem>
                                                <SelectItem value="yoga">Yoga</SelectItem>
                                                <SelectItem value="walking">Walking</SelectItem>
                                                <SelectItem value="hiit">HIIT</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (min)</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            value={data.duration}
                                            onChange={(e) => setData('duration', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="calories">Calories</Label>
                                        <Input
                                            id="calories"
                                            type="number"
                                            value={data.calories}
                                            onChange={(e) => setData('calories', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="distance">Distance (km)</Label>
                                        <Input
                                            id="distance"
                                            type="number"
                                            step="0.01"
                                            value={data.distance}
                                            onChange={(e) => setData('distance', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="heart_rate_avg">Avg Heart Rate (bpm)</Label>
                                    <Input
                                        id="heart_rate_avg"
                                        type="number"
                                        value={data.heart_rate_avg}
                                        onChange={(e) => setData('heart_rate_avg', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="How did you feel? Any observations..."
                                        rows={3}
                                    />
                                </div>

                                <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                                    <p className="text-sm text-muted-foreground">
                                        <Apple className="mb-1 mr-2 inline h-4 w-4" />
                                        Apple Watch sync coming soon. For now, manually enter your workout data.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log Exercise
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Workouts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {exercises.data.map((exercise) => (
                                    <div key={exercise.id} className="rounded-lg border p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium">{exercise.type}</p>
                                                <p className="text-sm text-muted-foreground">{exercise.date}</p>
                                            </div>
                                            {exercise.source === 'apple_watch' && (
                                                <Apple className="h-4 w-4 text-secondary" />
                                            )}
                                        </div>
                                        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                                            {exercise.duration && <span>{exercise.duration} min</span>}
                                            {exercise.calories && <span>{exercise.calories} cal</span>}
                                            {exercise.distance && <span>{exercise.distance} km</span>}
                                        </div>
                                    </div>
                                ))}
                                {exercises.data.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No exercises logged yet. Start tracking!
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
