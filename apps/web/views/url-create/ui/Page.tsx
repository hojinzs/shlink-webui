import { shlink } from "@shared/utils/shlink";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@app/auth";
import { formatTag, getDisplayTags, TAG_PREFIXES, buildUrlWithUtmParams, parseUtmTagsFromFormData } from "@shared/utils/tags";
import { UrlForm } from "@features/urls/url-form";

export default async function CreateUrlPage() {
    const tagsData = await shlink.listTags();
    const availableTags = getDisplayTags(tagsData.tags.data);

    async function createUrl(formData: FormData) {
        "use server";
        const longUrl = formData.get("longUrl") as string;
        const tags = formData.getAll("tags") as string[];
        const utmTags = formData.getAll("utmTags") as string[];
        
        // Extract optional fields
        const customSlug = formData.get("customSlug") as string;
        const shortCodeLength = formData.get("shortCodeLength") ? Number(formData.get("shortCodeLength")) : undefined;
        const title = formData.get("title") as string;
        const validSince = formData.get("validSince") as string;
        const validUntil = formData.get("validUntil") as string;
        const maxVisits = formData.get("maxVisits") ? Number(formData.get("maxVisits")) : undefined;
        const findIfExists = formData.get("findIfExists") === "on";
        const crawlable = formData.get("crawlable") === "on";
        const forwardQuery = formData.get("forwardQuery") === "on";

        if (!longUrl) return;

        const session = await auth();
        const userId = session?.user?.email || session?.user?.name || "unknown";

        // Build UTM parameters from tags for URL modification
        const utmParams = parseUtmTagsFromFormData(utmTags);

        // Build the final URL with UTM parameters appended
        const finalLongUrl = buildUrlWithUtmParams(longUrl, utmParams);

        const formattedTags = [
            ...tags.map(t => formatTag(TAG_PREFIXES.CUSTOM, t)),
            ...utmTags, // UTM tags are already formatted
            formatTag(TAG_PREFIXES.CREATED_BY, userId)
        ];

        await shlink.createShortUrl(finalLongUrl, formattedTags, {
            customSlug: customSlug || undefined,
            shortCodeLength,
            title: title || undefined,
            validSince: validSince || undefined,
            validUntil: validUntil || undefined,
            maxVisits,
            findIfExists,
            crawlable,
            forwardQuery
        });
        
        revalidatePath("/urls");
        redirect("/urls");
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create Short URL</h1>
            <UrlForm availableTags={availableTags} action={createUrl} submitLabel="Create Short URL" />
        </div>
    );
}
