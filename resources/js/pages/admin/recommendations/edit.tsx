import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

interface Recommendation {
    id: number;
    title: string;
    category: string;
    description: string;
    link: string | null;
    image_url: string | null;
    price: number | null;
    why_i_recommend: string | null;
    is_published: boolean;
    sort_order: number;
}

interface Props {
    recommendation: Recommendation;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/recommendations' },
    { title: 'Recommendations', href: '/admin/recommendations' },
    { title: 'Edit', href: '#' },
];

export default function EditRecommendation({ recommendation }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        title: recommendation.title,
        category: recommendation.category,
        description: recommendation.description,
        link: recommendation.link || '',
        image_url: recommendation.image_url || '',
        price: recommendation.price?.toString() || '',
        why_i_recommend: recommendation.why_i_recommend || '',
        is_published: recommendation.is_published,
        sort_order: recommendation.sort_order,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/admin/recommendations/${recommendation.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Recommendation" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Recommendation</h1>
                    <p className="mt-2 text-muted-foreground">Update product details</p>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Product Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="supplement">Supplement</SelectItem>
                                            <SelectItem value="device">Biohacking Device</SelectItem>
                                            <SelectItem value="app">App/Service</SelectItem>
                                            <SelectItem value="book">Book</SelectItem>
                                            <SelectItem value="equipment">Exercise Equipment</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="why_i_recommend">Why I Recommend This</Label>
                                <Textarea
                                    id="why_i_recommend"
                                    value={data.why_i_recommend}
                                    onChange={(e) => setData('why_i_recommend', e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Product Link</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-8">
                                    <Checkbox
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                    />
                                    <Label htmlFor="is_published" className="cursor-pointer">
                                        Published
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Recommendation
                                </Button>
                                <Link href="/admin/recommendations">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
