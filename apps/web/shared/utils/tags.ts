
export const TAG_PREFIXES = {
    TEAM: 'team',
    PROJECT: 'project',
    CREATED_BY: 'createdBy',
    CUSTOM: 'custom',
    UTM_SOURCE: 'utm_source',
    UTM_MEDIUM: 'utm_medium',
    UTM_CAMPAIGN: 'utm_campaign',
    UTM_TERM: 'utm_term',
    UTM_CONTENT: 'utm_content',
} as const;

export type TagPrefix = typeof TAG_PREFIXES[keyof typeof TAG_PREFIXES];

export const UTM_PREFIXES = [
    TAG_PREFIXES.UTM_SOURCE,
    TAG_PREFIXES.UTM_MEDIUM,
    TAG_PREFIXES.UTM_CAMPAIGN,
    TAG_PREFIXES.UTM_TERM,
    TAG_PREFIXES.UTM_CONTENT,
] as const;

export type UtmPrefix = typeof UTM_PREFIXES[number];

// Shared constant for UTM parameter keys to ensure consistency
const UTM_PARAMETER_KEYS: (keyof UtmParameters)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
] as const;

export interface ParsedTag {
    prefix: string | null;
    value: string;
    original: string;
}

export interface UtmParameters {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

export function parseTag(tag: string): ParsedTag {
    const parts = tag.split(':');
    if (parts.length > 1) {
        const prefix = parts[0]!;
        const value = parts.slice(1).join(':');
        return { prefix, value, original: tag };
    }
    return { prefix: null, value: tag, original: tag };
}

export function formatTag(prefix: TagPrefix, value: string): string {
    return `${prefix}:${value}`;
}

export function getDisplayTags(tags: string[]): string[] {
    return tags
        .map(parseTag)
        // Only display custom tags in the UI per tag management policy
        .filter(t => t.prefix === TAG_PREFIXES.CUSTOM)
        // For custom tags, show only the value (without prefix)
        .map(t => t.value);
}

export function isCustomTag(tag: string): boolean {
    const { prefix } = parseTag(tag);
    return prefix === TAG_PREFIXES.CUSTOM;
}

export function isUtmTag(tag: string): boolean {
    const { prefix } = parseTag(tag);
    return UTM_PREFIXES.includes(prefix as UtmPrefix);
}

export function extractUtmParameters(tags: string[]): UtmParameters {
    const utmParams: UtmParameters = {};
    tags.forEach(tag => {
        const { prefix, value } = parseTag(tag);
        if (prefix && UTM_PREFIXES.includes(prefix as UtmPrefix)) {
            utmParams[prefix as keyof UtmParameters] = value;
        }
    });
    return utmParams;
}

// Type-safe mapping between UtmParameters keys and their corresponding tag prefixes
const UTM_PARAM_TO_PREFIX: Record<keyof UtmParameters, UtmPrefix> = {
    utm_source: TAG_PREFIXES.UTM_SOURCE,
    utm_medium: TAG_PREFIXES.UTM_MEDIUM,
    utm_campaign: TAG_PREFIXES.UTM_CAMPAIGN,
    utm_term: TAG_PREFIXES.UTM_TERM,
    utm_content: TAG_PREFIXES.UTM_CONTENT,
};

export function utmParametersToTags(utmParams: UtmParameters): string[] {
    const tags: string[] = [];
    // Iterate over known UTM parameter keys for type safety
    UTM_PARAMETER_KEYS.forEach(key => {
        const value = utmParams[key];
        if (value && value.trim()) {
            const prefix = UTM_PARAM_TO_PREFIX[key];
            tags.push(formatTag(prefix, value.trim()));
        }
    });
    return tags;
}

// Validate UTM parameter value - only alphanumeric, hyphens, underscores, periods, and plus signs allowed
export function validateUtmValue(value: string): { valid: boolean; error?: string } {
    if (!value || value.trim() === '') {
        return { valid: true }; // Empty is valid (optional)
    }
    const trimmed = value.trim();
    // Allow alphanumeric, hyphens, underscores, periods, and plus signs
    const validPattern = /^[a-zA-Z0-9_\-\.+]+$/;
    if (!validPattern.test(trimmed)) {
        return { 
            valid: false, 
            error: 'Only letters, numbers, hyphens, underscores, periods, and plus signs are allowed' 
        };
    }
    return { valid: true };
}

// Build a URL with UTM parameters appended as query string
// Preserves existing non-UTM query parameters in the base URL
export function buildUrlWithUtmParams(baseUrl: string, utmParams: UtmParameters): string {
    if (!baseUrl) return '';
    
    try {
        const url = new URL(baseUrl);
        Object.entries(utmParams).forEach(([key, value]) => {
            const trimmedValue = value?.trim();
            if (trimmedValue) {
                url.searchParams.set(key, trimmedValue);
            }
        });
        return url.toString();
    } catch (error) {
        // Log the error instead of failing silently, but preserve existing fallback behavior
        // Don't log the baseUrl to avoid exposing sensitive information
        // eslint-disable-next-line no-console
        console.error('buildUrlWithUtmParams: invalid baseUrl provided', error);
        return baseUrl;
    }
}

// Extract UTM parameters from a URL's query string
export function extractUtmFromUrl(url: string): UtmParameters {
    try {
        const urlObj = new URL(url);
        const utmParams: UtmParameters = {};
        UTM_PARAMETER_KEYS.forEach(key => {
            const value = urlObj.searchParams.get(key);
            if (value) {
                utmParams[key] = value;
            }
        });
        return utmParams;
    } catch {
        return {};
    }
}

// Remove UTM parameters from a URL and return the base URL
export function getBaseUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        UTM_PARAMETER_KEYS.forEach(key => urlObj.searchParams.delete(key));
        return urlObj.toString();
    } catch {
        return url;
    }
}

// Parse UTM tags from FormData (used in URL creation/editing)
export function parseUtmTagsFromFormData(utmTags: string[]): UtmParameters {
    const utmParams: UtmParameters = {};
    
    utmTags.forEach(tag => {
        const [prefix, ...valueParts] = tag.split(':');
        const value = valueParts.join(':');
        // Validate prefix is a known UTM parameter key before assignment
        if (prefix && value && UTM_PARAMETER_KEYS.includes(prefix as keyof UtmParameters)) {
            utmParams[prefix as keyof UtmParameters] = value;
        }
    });
    return utmParams;
}
