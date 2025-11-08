import SettingsLayout from '@/layouts/settings/layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Key, Smartphone, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface Token {
    id: number;
    name: string;
    last_used_at: string | null;
    created_at: string;
}

interface Props {
    tokens: Token[];
}

export default function ApiTokens({ tokens }: Props) {
    const page = usePage<any>();
    const [showToken, setShowToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    useEffect(() => {
        if (page.props.token) {
            setShowToken((page.props.token as any).plainTextToken);
        }
    }, [page.props.token]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/settings/api-tokens', {
            onSuccess: () => reset(),
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const deleteToken = (tokenId: number) => {
        if (confirm('Are you sure you want to delete this API token? This action cannot be undone.')) {
            router.delete(`/settings/api-tokens/${tokenId}`);
        }
    };

    return (
        <SettingsLayout>
            <Head title="API Tokens" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">API Tokens</h1>
                    <p className="text-muted-foreground">
                        Manage API tokens for your iOS app to sync Apple Health data
                    </p>
                </div>

                {/* New Token Display */}
                {showToken && (
                    <Alert className="border-primary/50 bg-primary/5">
                        <Key className="h-4 w-4" />
                        <AlertDescription>
                            <p className="mb-2 font-semibold">API Token Created Successfully!</p>
                            <p className="mb-3 text-sm">
                                Copy this token now. You won't be able to see it again!
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 rounded bg-background p-3 text-sm">
                                    {showToken}
                                </code>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(showToken)}
                                >
                                    <Copy className="h-4 w-4" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Create Token Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5" />
                            Create New API Token
                        </CardTitle>
                        <CardDescription>
                            Generate a new token to connect your iOS app with Apple Health integration
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Token Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., My iPhone, iOS App"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                <p className="text-sm text-muted-foreground">
                                    Give your token a descriptive name to remember which device it's for
                                </p>
                            </div>

                            <Button type="submit" disabled={processing}>
                                <Key className="mr-2 h-4 w-4" />
                                Create Token
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing Tokens */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active API Tokens</CardTitle>
                        <CardDescription>
                            These tokens allow your iOS app to sync health data with your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tokens.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Smartphone className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                <p>No API tokens yet.</p>
                                <p className="text-sm">Create one above to connect your iOS app.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tokens.map((token) => (
                                    <div
                                        key={token.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">{token.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Created {new Date(token.created_at).toLocaleDateString()}
                                                {token.last_used_at && (
                                                    <> · Last used {new Date(token.last_used_at).toLocaleDateString()}</>
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteToken(token.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Documentation */}
                <Card>
                    <CardHeader>
                        <CardTitle>iOS App Integration Guide</CardTitle>
                        <CardDescription>
                            How to use the API token in your iOS app
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="mb-2 font-semibold">API Base URL:</h3>
                            <code className="block rounded bg-muted p-3 text-sm">
                                {window.location.origin}/api
                            </code>
                        </div>

                        <div>
                            <h3 className="mb-2 font-semibold">Authentication Header:</h3>
                            <code className="block rounded bg-muted p-3 text-sm">
                                Authorization: Bearer YOUR_TOKEN_HERE
                            </code>
                        </div>

                        <div>
                            <h3 className="mb-2 font-semibold">Available Endpoints:</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="rounded border p-3">
                                    <code className="font-semibold text-primary">POST /api/sync/biometrics</code>
                                    <p className="mt-1 text-muted-foreground">
                                        Sync sleep, heart rate, weight, and other biometric data
                                    </p>
                                </li>
                                <li className="rounded border p-3">
                                    <code className="font-semibold text-secondary">POST /api/sync/exercises</code>
                                    <p className="mt-1 text-muted-foreground">
                                        Sync workouts and exercise data from Apple Health
                                    </p>
                                </li>
                                <li className="rounded border p-3">
                                    <code className="font-semibold text-accent">POST /api/sync/batch</code>
                                    <p className="mt-1 text-muted-foreground">
                                        Sync multiple data types in a single request
                                    </p>
                                </li>
                                <li className="rounded border p-3">
                                    <code className="font-semibold">GET /api/sync/status</code>
                                    <p className="mt-1 text-muted-foreground">
                                        Get sync status and last sync timestamps
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SettingsLayout>
    );
}
