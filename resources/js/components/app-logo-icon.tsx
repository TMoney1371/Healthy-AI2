    import React from 'react';

    export default function AppLogoIcon(props: React.HTMLAttributes<HTMLDivElement>) {
        return (
            <div
                {...props}
                className={`text-2xl ${props.className || ''}`.trim()}
            >🌿</div>
        );
    }