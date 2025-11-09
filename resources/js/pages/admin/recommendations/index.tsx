import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Recommendation {
    id: number;
    title: string;
    category: string;
    description: string;
    link: string | null;
    price: number | null;
    is_published: boolean;
    sort_order: number;
    deleted_at: string | null;
}

interface Props {
    recommendations: Recommendation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/recommendations' },
    { title: 'Recommendations', href: '/admin/recommendations' },
];

export default function AdminRecommendationsIndex({ recommendations }: Props) {
    const deleteRecommendation = (id: number) => {
        if (confirm('Are you sure you want to delete this recommendation?')) {
            router.delete(`/admin/recommendations/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Recommendations" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">TC's Recommendations</h1>
                        <p className="mt-2 text-muted-foreground">Manage product recommendations for users</p>
                    </div>
                    <Link href="/admin/recommendations/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Recommendation
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {recommendations.map((rec) => (
                        <Card key={rec.id} className={rec.deleted_at ? 'opacity-50' : ''}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <CardTitle>{rec.title}</CardTitle>
                                            <Badge variant={rec.is_published ? 'default' : 'secondary'}>
                                                {rec.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                            <Badge variant="outline">{rec.category}</Badge>
                                            {rec.deleted_at && <Badge variant="destructive">Deleted</Badge>}
                                        </div>
                                        {rec.price && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                ${rec.price.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/recommendations/${rec.id}/edit`}>
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {!rec.deleted_at && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteRecommendation(rec.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                                {rec.link && (
                                    <a
                                        href={rec.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm text-primary hover:underline"
                                    >
                                        View Product →
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {recommendations.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No recommendations yet. Add your first product recommendation!
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
