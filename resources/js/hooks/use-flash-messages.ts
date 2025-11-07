import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function useFlashMessages(): void {
    const { flash } = usePage<{ flash: FlashMessages }>().props;
    const previousFlashRef = useRef<FlashMessages>({});

    useEffect(() => {
        if (!flash) {
            return;
        }

        // Check each flash message type and show toast if it exists and is different from previous
        if (flash.success && flash.success !== previousFlashRef.current.success) {
            toast.success(flash.success, {
                duration: 4000,
            });
        }

        if (flash.error && flash.error !== previousFlashRef.current.error) {
            toast.error(flash.error, {
                duration: 4000,
            });
        }

        if (flash.warning && flash.warning !== previousFlashRef.current.warning) {
            toast.warning(flash.warning, {
                duration: 4000,
            });
        }

        if (flash.info && flash.info !== previousFlashRef.current.info) {
            toast.info(flash.info, {
                duration: 4000,
            });
        }

        // Update the ref to track what we've shown
        previousFlashRef.current = flash;
    }, [flash]);
}

