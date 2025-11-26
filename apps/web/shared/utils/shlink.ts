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
  meta: {
    validSince?: string;
    validUntil?: string;
    maxVisits?: number;
  };
  crawlable?: boolean;
  forwardQuery?: boolean;
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

export interface VisitsSummary {
  visits: {
    nonOrphanVisits: {
      total: number;
      nonBots: number;
      bots: number;
    };
    orphanVisits: {
      total: number;
      nonBots: number;
      bots: number;
    };
  };
}

export const shlink = {
  async listShortUrls(
    page = 1,
    itemsPerPage = 20
  ): Promise<ShlinkResponse<ShortUrl>> {
    const res = await fetch(
      `${SHLINK_URL}/rest/v3/short-urls?page=${page}&itemsPerPage=${itemsPerPage}`,
      {
        headers: {
          "X-Api-Key": SHLINK_API_KEY!,
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch short URLs: ${res.statusText}`);
    }

    return res.json();
  },

  async listTags(): Promise<{ tags: { data: string[] } }> {
    const res = await fetch(`${SHLINK_URL}/rest/v3/tags`, {
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tags: ${res.statusText}`);
    }

    return res.json();
  },

  async getTagsStats(
    tags: string[]
  ): Promise<Record<string, { shortUrlsCount: number; visitsCount: number }>> {
    const stats: Record<
      string,
      { shortUrlsCount: number; visitsCount: number }
    > = {};

    await Promise.all(
      tags.map(async (tag) => {
        try {
          const [shortUrlsRes, visitsRes] = await Promise.all([
            fetch(
              `${SHLINK_URL}/rest/v3/short-urls?tags[]=${encodeURIComponent(tag)}&itemsPerPage=1`,
              {
                headers: {
                  "X-Api-Key": SHLINK_API_KEY!,
                  Accept: "application/json",
                },
                cache: "no-store",
              }
            ),
            fetch(
              `${SHLINK_URL}/rest/v3/tags/${encodeURIComponent(tag)}/visits?itemsPerPage=1`,
              {
                headers: {
                  "X-Api-Key": SHLINK_API_KEY!,
                  Accept: "application/json",
                },
                cache: "no-store",
              }
            ),
          ]);

          const shortUrlsData = shortUrlsRes.ok
            ? await shortUrlsRes.json()
            : { pagination: { totalItems: 0 } };
          const visitsData = visitsRes.ok
            ? await visitsRes.json()
            : { pagination: { totalItems: 0 } };

          stats[tag] = {
            shortUrlsCount:
              shortUrlsData.shortUrls?.pagination?.totalItems ??
              shortUrlsData.pagination?.totalItems ??
              0,
            visitsCount:
              visitsData.visits?.pagination?.totalItems ??
              visitsData.pagination?.totalItems ??
              0,
          };
        } catch (error) {
          console.error(`Failed to fetch stats for tag ${tag}:`, error);
          stats[tag] = { shortUrlsCount: 0, visitsCount: 0 };
        }
      })
    );

    return stats;
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

  async createShortUrl(
    longUrl: string,
    tags: string[] = [],
    options: {
      customSlug?: string;
      shortCodeLength?: number;
      domain?: string;
      findIfExists?: boolean;
      validSince?: string;
      validUntil?: string;
      maxVisits?: number;
      title?: string;
      crawlable?: boolean;
      forwardQuery?: boolean;
    } = {}
  ) {
    const body: any = { longUrl, tags, ...options };

    const res = await fetch(`${SHLINK_URL}/rest/v3/short-urls`, {
      method: "POST",
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Failed to create short URL: ${res.statusText} ${
          errorData.detail ? `(${errorData.detail})` : ""
        }`
      );
    }

    return res.json();
  },

  async getShortUrl(shortCode: string): Promise<ShortUrl> {
    const res = await fetch(`${SHLINK_URL}/rest/v3/short-urls/${shortCode}`, {
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch short URL: ${res.statusText}`);
    }

    return res.json();
  },

  async updateShortUrl(
    shortCode: string,
    data: {
      longUrl?: string;
      tags?: string[];
      title?: string;
      validSince?: string | null;
      validUntil?: string | null;
      maxVisits?: number | null;
      crawlable?: boolean;
      forwardQuery?: boolean;
    }
  ): Promise<ShortUrl> {
    const res = await fetch(`${SHLINK_URL}/rest/v3/short-urls/${shortCode}`, {
      method: "PATCH",
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Failed to update short URL: ${res.statusText} ${
          errorData.detail ? `(${errorData.detail})` : ""
        }`
      );
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

  async getVisits(): Promise<VisitsSummary> {
    const res = await fetch(`${SHLINK_URL}/rest/v3/visits`, {
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch visits: ${res.statusText}`);
    }

    return res.json();
  },

  async getOrphanVisits(): Promise<{ visits: { data: any[], pagination: { totalItems: number } } }> {
    const res = await fetch(`${SHLINK_URL}/rest/v3/visits/orphan`, {
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch orphan visits: ${res.statusText}`);
    }

    return res.json();
  },
  async renameTag(oldName: string, newName: string): Promise<void> {
    const res = await fetch(`${SHLINK_URL}/rest/v3/tags`, {
      method: "PUT",
      headers: {
        "X-Api-Key": SHLINK_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldName, newName }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Failed to rename tag: ${res.statusText} ${
          errorData.detail ? `(${errorData.detail})` : ""
        }`
      );
    }
  },

  async deleteTags(tags: string[]): Promise<void> {
    const searchParams = new URLSearchParams();
    tags.forEach((tag) => searchParams.append("tags[]", tag));

    const res = await fetch(
      `${SHLINK_URL}/rest/v3/tags?${searchParams.toString()}`,
      {
        method: "DELETE",
        headers: {
          "X-Api-Key": SHLINK_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete tags: ${res.statusText}`);
    }
  },
};
