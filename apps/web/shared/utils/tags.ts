
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
        .filter(t => t.prefix === TAG_PREFIXES.CUSTOM)
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

export function utmParametersToTags(utmParams: UtmParameters): string[] {
    const tags: string[] = [];
    Object.entries(utmParams).forEach(([key, value]) => {
        if (value && value.trim()) {
            tags.push(formatTag(key as TagPrefix, value.trim()));
        }
    });
    return tags;
}

// Validate UTM parameter value - only alphanumeric, hyphens, underscores allowed
export function validateUtmValue(value: string): { valid: boolean; error?: string } {
    if (!value || value.trim() === '') {
        return { valid: true }; // Empty is valid (optional)
    }
    const trimmed = value.trim();
    // Allow alphanumeric, hyphens, underscores, and periods
    const validPattern = /^[a-zA-Z0-9_\-\.]+$/;
    if (!validPattern.test(trimmed)) {
        return { 
            valid: false, 
            error: 'Only letters, numbers, hyphens, underscores, and periods are allowed' 
        };
    }
    return { valid: true };
}

export function buildUrlWithUtmParams(baseUrl: string, utmParams: UtmParameters): string {
    if (!baseUrl) return '';
    
    try {
        const url = new URL(baseUrl);
        Object.entries(utmParams).forEach(([key, value]) => {
            if (value && value.trim()) {
                url.searchParams.set(key, value.trim());
            }
        });
        return url.toString();
    } catch {
        return baseUrl;
    }
}
