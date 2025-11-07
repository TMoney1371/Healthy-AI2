<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShowOgTemplateOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only modify response if X-OG-Generator header is present
        if (! $request->hasHeader('X-OG-Generator')) {
            return $response;
        }

        // Get the response content
        $content = $response->getContent();

        if ($content === false) {
            return $response;
        }

        // Inject CSS and JS to hide everything except the template content
        $injectedStyle = <<<'HTML'
<style>
    /* Hide everything by default */
    body > *:not(template) {
        display: none !important;
    }
    
    /* Show the template content */
    template[data-og-template] {
        display: block !important;
    }
    
    /* Make template content visible */
    body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: transparent;
    }
    
    /* Ensure template content is visible */
    template[data-og-template] > * {
        display: block !important;
    }
</style>
<script>
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const template = document.querySelector('template[data-og-template]');
        if (template && template.content) {
            // Clone template content
            const clone = template.content.cloneNode(true);
            
            // Clear body and append cloned content
            document.body.innerHTML = '';
            if (clone.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                // If it's a DocumentFragment, append its children
                while (clone.firstChild) {
                    document.body.appendChild(clone.firstChild);
                }
            } else {
                document.body.appendChild(clone);
            }
        }
    });
</script>
HTML;

        // Inject the style before closing </head> tag
        $content = str_replace('</head>', $injectedStyle.'</head>', $content);

        $response->setContent($content);

        return $response;
    }
}

