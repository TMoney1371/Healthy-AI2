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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/recommendations' },
    { title: 'Recommendations', href: '/admin/recommendations' },
    { title: 'Create', href: '/admin/recommendations/create' },
];

export default function CreateRecommendation() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: 'supplement',
        description: '',
        link: '',
        image_url: '',
        price: '',
        why_i_recommend: '',
        is_published: true,
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/recommendations');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Recommendation" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Recommendation</h1>
                    <p className="mt-2 text-muted-foreground">Share your favorite products with users</p>
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
                                    placeholder="e.g., AG1 Athletic Greens"
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
                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="29.99"
                                    />
                                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief overview of the product..."
                                    rows={3}
                                    required
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="why_i_recommend">Why I Recommend This</Label>
                                <Textarea
                                    id="why_i_recommend"
                                    value={data.why_i_recommend}
                                    onChange={(e) => setData('why_i_recommend', e.target.value)}
                                    placeholder="Share your personal experience and why you love this product..."
                                    rows={4}
                                />
                                {errors.why_i_recommend && <p className="text-sm text-destructive">{errors.why_i_recommend}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Product Link (URL)</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    placeholder="https://example.com/product"
                                />
                                {errors.link && <p className="text-sm text-destructive">{errors.link}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {errors.image_url && <p className="text-sm text-destructive">{errors.image_url}</p>}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                                </div>

                                <div className="flex items-center space-x-2 pt-8">
                                    <Checkbox
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                    />
                                    <Label htmlFor="is_published" className="cursor-pointer">
                                        Publish immediately
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Recommendation
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
