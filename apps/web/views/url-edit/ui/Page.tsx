import { shlink } from "@shared/utils/shlink";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@app/auth";
import { formatTag, getDisplayTags, TAG_PREFIXES, extractUtmParameters, buildUrlWithUtmParams, UtmParameters } from "@shared/utils/tags";
import { UrlForm } from "@features/urls/url-form";

interface EditUrlPageProps {
    shortCode: string;
}

// Helper to extract base URL without UTM parameters
function getBaseUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        utmKeys.forEach(key => urlObj.searchParams.delete(key));
        return urlObj.toString();
    } catch {
        return url;
    }
}

// Helper to extract UTM parameters from URL
function extractUtmFromUrl(url: string): UtmParameters {
    try {
        const urlObj = new URL(url);
        const utmParams: UtmParameters = {};
        const utmKeys: (keyof UtmParameters)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        utmKeys.forEach(key => {
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

export default async function EditUrlPage({ shortCode }: EditUrlPageProps) {
    const [tagsData, shortUrlData] = await Promise.all([
        shlink.listTags(),
        shlink.getShortUrl(shortCode)
    ]);

    const availableTags = getDisplayTags(tagsData.tags.data);

    async function updateUrl(formData: FormData) {
        "use server";
        const longUrl = formData.get("longUrl") as string;
        const tags = formData.getAll("tags") as string[];
        const utmTags = formData.getAll("utmTags") as string[];

        // Extract optional fields
        const title = formData.get("title") as string;
        const validSince = formData.get("validSince") as string;
        const validUntil = formData.get("validUntil") as string;
        const maxVisits = formData.get("maxVisits") ? Number(formData.get("maxVisits")) : undefined;
        const crawlable = formData.get("crawlable") === "on";
        const forwardQuery = formData.get("forwardQuery") === "on";

        if (!longUrl) return;

        const session = await auth();
        const userId = session?.user?.email || session?.user?.name || "unknown";

        // Build UTM parameters from tags for URL modification
        const utmParams: UtmParameters = {};
        utmTags.forEach(tag => {
            const [prefix, ...valueParts] = tag.split(':');
            const value = valueParts.join(':');
            if (prefix && value) {
                utmParams[prefix as keyof UtmParameters] = value;
            }
        });

        // Build the final URL with UTM parameters appended
        const finalLongUrl = buildUrlWithUtmParams(longUrl, utmParams);

        const formattedTags = [
            ...tags.map(t => formatTag(TAG_PREFIXES.CUSTOM, t)),
            ...utmTags, // UTM tags are already formatted
            formatTag(TAG_PREFIXES.CREATED_BY, userId)
        ];

        await shlink.updateShortUrl(shortCode, {
            longUrl: finalLongUrl,
            tags: formattedTags,
            title: title || undefined,
            validSince: validSince || null,
            validUntil: validUntil || null,
            maxVisits: maxVisits ?? null,
            crawlable,
            forwardQuery
        });

        revalidatePath("/urls");
        redirect("/urls");
    }

    async function deleteUrl() {
        "use server";
        await shlink.deleteShortUrl(shortCode);
        revalidatePath("/urls");
        redirect("/urls");
    }

    // Extract UTM parameters from both tags and URL
    const utmFromTags = extractUtmParameters(shortUrlData.tags);
    const utmFromUrl = extractUtmFromUrl(shortUrlData.longUrl);
    // Merge UTM params, preferring tags over URL params
    const utmParams = { ...utmFromUrl, ...utmFromTags };
    
    // Get base URL without UTM parameters for editing
    const baseUrl = getBaseUrl(shortUrlData.longUrl);

    // Prepare initial data
    const initialData = {
        longUrl: baseUrl,
        tags: getDisplayTags(shortUrlData.tags),
        title: (shortUrlData as any).title,
        customSlug: shortUrlData.shortCode,
        shortCodeLength: undefined,
        validSince: (shortUrlData as any).meta?.validSince?.split("+")[0],
        validUntil: (shortUrlData as any).meta?.validUntil?.split("+")[0],
        maxVisits: (shortUrlData as any).meta?.maxVisits,
        crawlable: (shortUrlData as any).crawlable,
        forwardQuery: (shortUrlData as any).forwardQuery,
        utmParams,
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Short URL</h1>
            <UrlForm
                availableTags={availableTags}
                initialData={initialData}
                action={updateUrl}
                onDelete={deleteUrl}
                submitLabel="Save Changes"
            />
        </div>
    );
}
