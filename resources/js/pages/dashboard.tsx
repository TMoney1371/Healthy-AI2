import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Apple, Calendar, Camera, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="mt-2 text-muted-foreground">Your health tracking dashboard</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/timeline">
                        <Card className="transition-all hover:border-primary hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                                <Calendar className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">View your health journey</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/biometrics">
                        <Card className="transition-all hover:border-primary hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Biometrics</CardTitle>
                                <Activity className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Sleep, weight, vitals</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/exercises">
                        <Card className="transition-all hover:border-secondary hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Exercises</CardTitle>
                                <Apple className="h-4 w-4 text-secondary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Log workouts</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/meals">
                        <Card className="transition-all hover:border-accent hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Meals</CardTitle>
                                <Camera className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Track nutrition</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Quick Start
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Start tracking your health journey today. Log your first data point to see insights and trends.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/biometrics">
                                <Button variant="outline">Log Biometrics</Button>
                            </Link>
                            <Link href="/exercises">
                                <Button variant="outline">Log Exercise</Button>
                            </Link>
                            <Link href="/meals">
                                <Button>Log Meal with Photo</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
