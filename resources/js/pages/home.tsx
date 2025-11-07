import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Activity, Apple, Calendar, Camera, Moon, Utensils } from 'lucide-react';

export default function Home() {
    return (
        <GuestLayout>
            <Head title="Track Your Health Journey" />
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
                                Your Health,
                                <br />
                                <span className="text-primary">Beautifully Tracked</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                                Monitor sleep, exercise, nutrition, and supplements with elegance.
                                Sync your Apple Watch, analyze meals with AI, and visualize your wellness journey.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="h-12 px-8 text-base">
                                        Start Tracking Free
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Sleep Tracking */}
                            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                    <Moon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-card-foreground">Sleep Tracking</h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    Monitor sleep quality, duration, and patterns over time for optimal rest.
                                </p>
                            </div>

                            {/* Exercise & Apple Watch */}
                            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-secondary/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                                    <Apple className="h-6 w-6 text-secondary" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-card-foreground">Apple Watch Sync</h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    Seamlessly import workouts, heart rate, and activity data from your Apple Watch.
                                </p>
                            </div>

                            {/* Nutrition with AI */}
                            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-accent/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                                    <Camera className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-card-foreground">AI Food Analysis</h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    Snap a photo of your meal and get instant nutritional estimates powered by AI.
                                </p>
                            </div>

                            {/* Supplements */}
                            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-chart-4/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10">
                                    <Utensils className="h-6 w-6 text-chart-4" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-card-foreground">Supplement Tracker</h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    Log daily vitamins and supplements with reminders and adherence tracking.
                                </p>
                            </div>

                            {/* Timeline View */}
                            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-chart-3/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
                                    <Calendar className="h-6 w-6 text-chart-3" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-card-foreground">Visual Timeline</h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    See your health data beautifully visualized across days, weeks, and months.
                                </p>
                            </div>

                            {/* Biometrics */}
                            <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-chart-5/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10">
                                    <Activity className="h-6 w-6 text-chart-5" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-card-foreground">Biometric Trends</h3>
                                <p className="leading-relaxed text-muted-foreground">
                                    Track weight, heart rate, blood pressure, and more with trend analysis.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="rounded-3xl border border-border bg-card p-12 shadow-lg">
                            <h2 className="text-3xl font-bold text-card-foreground lg:text-4xl">
                                Ready to transform your health tracking?
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                                Join thousands tracking their wellness with the most beautiful health app.
                            </p>
                            <div className="mt-8">
                                <Link href="/register">
                                    <Button size="lg" className="h-12 px-8 text-base">
                                        Get Started Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </GuestLayout>
    );
}
