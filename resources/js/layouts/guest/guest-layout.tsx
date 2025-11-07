import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col">
            <header className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 w-full items-center justify-between px-4 md:max-w-7xl">
                    <Link
                        href={home()}
                        className="flex items-center gap-2"
                        prefetch
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-5" />
                        </div>
                    </Link>

                    <nav className="flex items-center gap-3 hidden">
                        {auth.user ? (
                            <Button variant="outline" asChild>
                                <Link href={dashboard()}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex flex-1 flex-col">{children}</main>
        </div>
        </>
    );
}

