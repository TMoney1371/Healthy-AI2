<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowIframeEmbedding
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (app()->isLocal()) {
            VerifyCsrfToken::except([
                '*',
            ]);
        }

        $response = $next($request);

        if (app()->isLocal()) {
            $response->headers->remove('X-Frame-Options');

            $response->headers->set('Content-Security-Policy', 'frame-ancestors *');
        }

        return $response;
    }
}
