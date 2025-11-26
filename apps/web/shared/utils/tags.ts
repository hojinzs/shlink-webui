
export const TAG_PREFIXES = {
    TEAM: 'team',
    PROJECT: 'project',
    CREATED_BY: 'createdBy',
    CUSTOM: 'custom',
} as const;

export type TagPrefix = typeof TAG_PREFIXES[keyof typeof TAG_PREFIXES];

export interface ParsedTag {
    prefix: string | null;
    value: string;
    original: string;
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
