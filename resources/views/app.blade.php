<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

                        <!-- Ship Today Start -->
        @if (app()->isProduction() === false)
            <meta name="robots" content="noindex, nofollow">
            <script src="{{ config('app.ship_url') }}/listener.js"></script>

            {{-- @todo check if boost (config/boost hack) could fit here... --}}
        @endif
        <!-- Ship Today End -->

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Ship.today') }}</title>

        {{-- OpenGraph meta tags (server-side rendered, can be overridden via page props) --}}
        @php
            $ogTitle = $page['props']['ogTitle'] ?? config('app.name', 'Ship.today');
            $ogDescription = $page['props']['ogDescription'] ?? config('app.name', 'Ship.today').' - Your idea. Shipped today.';
            $ogImageUrl = $page['props']['ogImageUrl'] ?? config('app.ship_url').'/og/'.config('app.ship_id').'.jpeg?url='.urlencode(request()->url());
            $ogUrl = str_replace('http://', 'https://', $page['props']['ogUrl'] ?? request()->url());
        @endphp
        <meta property="og:title" content="{{ $ogTitle }}" />
        <meta property="og:description" content="{{ $ogDescription }}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="{{ $ogUrl }}" />
        @if($ogImageUrl)
            <meta property="og:image" content="{{ $ogImageUrl }}" />
        @endif
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $ogTitle }}" />
        <meta name="twitter:description" content="{{ $ogDescription }}" />
        @if($ogImageUrl)
            <meta name="twitter:image" content="{{ $ogImageUrl }}" />
        @endif

        <link rel="icon" href="/favicon.svg" type="image/svg+xml">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <template data-og-template class="hidden">
            <div class="bg-slate-200 w-full h-full p-16 flex flex-col justify-between" style="width: 1200px; height: 630px;">
                <img src="/logo.svg" alt="{{ config('app.name', 'Ship.today') }} logo" class="w-[400px] h-[69px]" />
                <p class="text-7xl font-semibold max-w-4xl pt-16 mb-24">
                    <span data-og-title>{{ config('app.name', 'Ship.today') }}</span>
                    <span class="text-blue-600" data-og-description> - Your idea. Shipped today.</span>
                </p>
            </div>
        </template>

        @inertia
    </body>
</html>
