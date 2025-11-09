import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sparkles } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Recommendation {
    id: number;
    title: string;
    category: string;
    description: string;
    link: string | null;
    image_url: string | null;
    price: number | null;
    why_i_recommend: string | null;
}

interface Props {
    recommendations: Recommendation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "TC's Recommendations", href: '/recommendations' },
];

export default function RecommendationsIndex({ recommendations }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="TC's Recommendations" />
            
            <div className="space-y-6 p-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">TC's Personal Recommendations</h1>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                        Products and tools I personally use and recommend for optimal health and performance
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        {recommendations.map((rec) => (
                            <Card key={rec.id} className="flex flex-col transition-all hover:shadow-lg">
                                {rec.image_url && (
                                    <div className="aspect-video overflow-hidden rounded-t-lg border-b">
                                        <img
                                            src={rec.image_url}
                                            alt={rec.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Badge variant="secondary">{rec.category}</Badge>
                                                {rec.price && (
                                                    <Badge variant="outline">${rec.price.toFixed(2)}</Badge>
                                                )}
                                            </div>
                                            <CardTitle>{rec.title}</CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription className="mt-2">{rec.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    {rec.why_i_recommend && (
                                        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                            <p className="text-sm font-medium text-primary">Why TC Recommends:</p>
                                            <p className="mt-2 text-sm leading-relaxed">{rec.why_i_recommend}</p>
                                        </div>
                                    )}
                                    {rec.link && (
                                        <a href={rec.link} target="_blank" rel="noopener noreferrer">
                                            <Button className="w-full">
                                                View Product
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {recommendations.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Sparkles className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p>No recommendations available yet. Check back soon!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
