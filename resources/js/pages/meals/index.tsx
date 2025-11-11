import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Loader2, Utensils } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler, useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/MealController';

interface Meal {
    id: number;
    consumed_at: string;
    meal_type: string;
    name: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    photo_path: string | null;
    photo_url?: string;
    ai_analyzed: boolean;
}

interface Props {
    meals: {
        data: Meal[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meals', href: '/meals' },
];

export default function MealsIndex({ meals }: Props) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        consumed_at: new Date().toISOString().slice(0, 16),
        meal_type: 'lunch',
        name: '',
        description: '',
        photo: null as File | null,
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        notes: '',
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store().url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPhotoPreview(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meals & Nutrition" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meals & Nutrition</h1>
                    <p className="mt-2 text-muted-foreground">Log your meals and track nutritional intake</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Log Meal Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Utensils className="h-5 w-5" />
                                Log New Meal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="photo">Meal Photo (AI Analysis)</Label>
                                    <div className="flex flex-col gap-4">
                                        {photoPreview && (
                                            <div className="relative aspect-video overflow-hidden rounded-lg border">
                                                <img
                                                    src={photoPreview}
                                                    alt="Meal preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="photo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="photo"
                                                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 text-sm transition-colors hover:bg-accent"
                                            >
                                                <Camera className="h-4 w-4" />
                                                {photoPreview ? 'Change Photo' : 'Take or Upload Photo'}
                                            </Label>
                                        </div>
                                    </div>
                                    {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                                    {photoPreview && (
                                        <p className="text-xs text-muted-foreground">
                                            ✨ AI will automatically analyze this photo and estimate nutrition
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="consumed_at">Date & Time</Label>
                                        <Input
                                            id="consumed_at"
                                            type="datetime-local"
                                            value={data.consumed_at}
                                            onChange={(e) => setData('consumed_at', e.target.value)}
                                            required
                                        />
                                        {errors.consumed_at && <p className="text-sm text-destructive">{errors.consumed_at}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meal_type">Meal Type</Label>
                                        <Select value={data.meal_type} onValueChange={(value) => setData('meal_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                                <SelectItem value="lunch">Lunch</SelectItem>
                                                <SelectItem value="dinner">Dinner</SelectItem>
                                                <SelectItem value="snack">Snack</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.meal_type && <p className="text-sm text-destructive">{errors.meal_type}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Meal Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Grilled Chicken Salad"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Ingredients, preparation notes..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-4">
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
                                        <Label htmlFor="protein">Protein (g)</Label>
                                        <Input
                                            id="protein"
                                            type="number"
                                            step="0.1"
                                            value={data.protein}
                                            onChange={(e) => setData('protein', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="carbs">Carbs (g)</Label>
                                        <Input
                                            id="carbs"
                                            type="number"
                                            step="0.1"
                                            value={data.carbs}
                                            onChange={(e) => setData('carbs', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fat">Fat (g)</Label>
                                        <Input
                                            id="fat"
                                            type="number"
                                            step="0.1"
                                            value={data.fat}
                                            onChange={(e) => setData('fat', e.target.value)}
                                            placeholder="0"
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
                                        rows={2}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log Meal
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Recent Meals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Meals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {meals.data.map((meal) => (
                                    <div key={meal.id} className="rounded-lg border p-4">
                                        {meal.photo_url && (
                                            <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                                                <img
                                                    src={meal.photo_url}
                                                    alt={meal.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium">{meal.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="font-medium">{meal.calories} cal</p>
                                                <p className="text-muted-foreground">{meal.protein}g protein</p>
                                            </div>
                                        </div>
                                        {meal.ai_analyzed && (
                                            <div className="mt-2 rounded bg-accent/10 px-2 py-1 text-xs text-accent">
                                                AI Analyzed
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {meals.data.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No meals logged yet. Start by adding your first meal!
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
