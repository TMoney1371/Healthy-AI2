import GuestLayoutTemplate from '@/layouts/guest/guest-layout';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { type ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    useFlashMessages();

    return <GuestLayoutTemplate>{children}</GuestLayoutTemplate>;
}

