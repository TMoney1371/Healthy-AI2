import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Apple, Calendar, Camera, Moon, Pill, TrendingUp, Utensils } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Biometric {
    id: number;
    recorded_at: string;
    type: string;
    value: number | null;
    unit: string | null;
    notes: string | null;
}

interface Exercise {
    id: number;
    date: string;
    type: string;
    duration: number | null;
    calories: number | null;
    distance: number | null;
}

interface Meal {
    id: number;
    consumed_at: string;
    meal_type: string;
    name: string;
    calories: number | null;
    protein: number | null;
    photo_path: string | null;
}

interface Supplement {
    id: number;
    taken_at: string;
    name: string;
    dosage: string | null;
}

interface Stats {
    total_exercises: number;
    total_calories_burned: number;
    total_meals: number;
    total_calories_consumed: number;
    avg_protein: number;
    total_supplements: number;
}

interface Props {
    biometrics: Biometric[];
    exercises: Exercise[];
    meals: Meal[];
    supplements: Supplement[];
    stats: Stats;
    startDate: string;
    endDate: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Timeline', href: '/timeline' },
];

export default function TimelineIndex({ exercises, meals, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Timeline" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Health Journey</h1>
                        <p className="mt-2 text-muted-foreground">Track and visualize your wellness over time</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/biometrics">
                            <Button variant="outline">
                                <Activity className="mr-2 h-4 w-4" />
                                Log Biometrics
                            </Button>
                        </Link>
                        <Link href="/meals">
                            <Button>
                                <Camera className="mr-2 h-4 w-4" />
                                Log Meal
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Workouts</CardTitle>
                            <Apple className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_exercises}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_calories_burned?.toLocaleString()} calories burned
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-accent/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Meals Logged</CardTitle>
                            <Utensils className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_meals}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_calories_consumed?.toLocaleString()} calories consumed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-secondary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Protein</CardTitle>
                            <TrendingUp className="h-4 w-4 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avg_protein?.toFixed(1)}g</div>
                            <p className="text-xs text-muted-foreground">per meal</p>
                        </CardContent>
                    </Card>

                    <Card className="border-chart-4/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Supplements</CardTitle>
                            <Pill className="h-4 w-4 text-chart-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_supplements}</div>
                            <p className="text-xs text-muted-foreground">doses taken</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Quick Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                            <Link href="/biometrics">
                                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
                                    <Moon className="h-6 w-6 text-primary" />
                                    <span className="text-sm">Sleep & Biometrics</span>
                                </Button>
                            </Link>
                            <Link href="/exercises">
                                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
                                    <Apple className="h-6 w-6 text-secondary" />
                                    <span className="text-sm">Exercise</span>
                                </Button>
                            </Link>
                            <Link href="/meals">
                                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
                                    <Camera className="h-6 w-6 text-accent" />
                                    <span className="text-sm">Meal Photo</span>
                                </Button>
                            </Link>
                            <Link href="/supplements">
                                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
                                    <Pill className="h-6 w-6 text-chart-4" />
                                    <span className="text-sm">Supplements</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {exercises.slice(0, 3).map((exercise) => (
                                <div key={exercise.id} className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                                        <Apple className="h-5 w-5 text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{exercise.type}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {exercise.duration} min • {exercise.calories} cal
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">{exercise.date}</div>
                                </div>
                            ))}
                            
                            {meals.slice(0, 3).map((meal) => (
                                <div key={meal.id} className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                                        <Utensils className="h-5 w-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{meal.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {meal.meal_type} • {meal.calories} cal • {meal.protein}g protein
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(meal.consumed_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}

                            {exercises.length === 0 && meals.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    No activity yet. Start logging your health data!
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
