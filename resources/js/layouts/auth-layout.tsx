import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { useFlashMessages } from '@/hooks/use-flash-messages';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    useFlashMessages();

    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
