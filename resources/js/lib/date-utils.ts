/**
 * Format a date string to a readable format
 * @param dateString - ISO date string (e.g., "2025-11-08T00:00:00.000000Z")
 * @returns Formatted date (e.g., "Nov 8, 2025")
 */
export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return '';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

/**
 * Format a datetime string to a readable format with time
 * @param dateString - ISO datetime string
 * @returns Formatted datetime (e.g., "Nov 8, 2025 at 3:30 PM")
 */
export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) {
        return '';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

/**
 * Format a datetime to just the time
 * @param dateString - ISO datetime string
 * @returns Formatted time (e.g., "3:30 PM")
 */
export function formatTime(dateString: string | null | undefined): string {
    if (!dateString) {
        return '';
    }
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
    });
}

/**
 * Format a date for display in charts (shorter format)
 * @param dateString - ISO date string
 * @returns Short format (e.g., "Nov 8")
 */
export function formatChartDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return '';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
    });
}

/**
 * Format relative time (e.g., "2 days ago", "yesterday")
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
    if (!dateString) {
        return '';
    }
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
        return formatDate(dateString);
    }
}
