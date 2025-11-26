const SHLINK_URL = process.env.SHLINK_URL;
const SHLINK_API_KEY = process.env.SHLINK_API_KEY;

if (!SHLINK_URL || !SHLINK_API_KEY) {
    console.warn("Missing SHLINK_URL or SHLINK_API_KEY environment variables");
}

export interface ShortUrl {
    shortCode: string;
    shortUrl: string;
    longUrl: string;
    dateCreated: string;
    visitsSummary: {
        total: number;
        nonBots: number;
        bots: number;
    };
    tags: string[];
}

export interface ShlinkResponse<T> {
    shortUrls: {
        data: T[];
        pagination: {
            currentPage: number;
            pagesCount: number;
            totalItems: number;
        };
    };
}

export const shlink = {
    async listShortUrls(page = 1, itemsPerPage = 20): Promise<ShlinkResponse<ShortUrl>> {
        const res = await fetch(`${SHLINK_URL}/rest/v3/short-urls?page=${page}&itemsPerPage=${itemsPerPage}`, {
            headers: {
                "X-Api-Key": SHLINK_API_KEY!,
                "Accept": "application/json",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch short URLs: ${res.statusText}`);
        }

        return res.json();
    },

    async listTags(): Promise<{ tags: { data: string[]; stats: Record<string, { shortUrlsCount: number; visitsCount: number }> } }> {
        const res = await fetch(`${SHLINK_URL}/rest/v3/tags?withStats=true`, {
            headers: {
                "X-Api-Key": SHLINK_API_KEY!,
                "Accept": "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch tags: ${res.statusText}`);
        }

        return res.json();
    },

    async createTags(tags: string[]): Promise<void> {
        // Workaround: POST /tags is not supported on this Shlink instance.
        // We create a dummy URL with the tags and then delete it.
        const dummyUrl = `https://example.com/tag-placeholder-${Date.now()}`;
        try {
            const shortUrl = await this.createShortUrl(dummyUrl, tags);
            await this.deleteShortUrl(shortUrl.shortCode);
        } catch (error) {
            console.error("[Shlink] Failed to create tags via workaround:", error);
            throw error;
        }
    },

    async createShortUrl(longUrl: string, tags: string[] = [], customSlug?: string) {
        const body: any = { longUrl, tags };
        if (customSlug) body.customSlug = customSlug;

        const res = await fetch(`${SHLINK_URL}/rest/v3/short-urls`, {
            method: "POST",
            headers: {
                "X-Api-Key": SHLINK_API_KEY!,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`Failed to create short URL: ${res.statusText}`);
        }

        return res.json();
    },

    async deleteShortUrl(shortCode: string): Promise<void> {
        const res = await fetch(`${SHLINK_URL}/rest/v3/short-urls/${shortCode}`, {
            method: "DELETE",
            headers: {
                "X-Api-Key": SHLINK_API_KEY!,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to delete short URL: ${res.statusText}`);
        }
    },

    getQrCodeUrl(shortCode: string, size = 300): string {
        return `${SHLINK_URL}/${shortCode}/qr-code?size=${size}&format=png`;
    },

    async getVisits(): Promise<{ visits: { data: any[] } }> {
        const res = await fetch(`${SHLINK_URL}/rest/v3/visits`, {
            headers: {
                "X-Api-Key": SHLINK_API_KEY!,
                "Accept": "application/json",
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch visits: ${res.statusText}`);
        }

        return res.json();
    },
};
