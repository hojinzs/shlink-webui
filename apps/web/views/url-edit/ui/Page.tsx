import { shlink } from "@shared/utils/shlink";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@app/auth";
import { formatTag, getDisplayTags, TAG_PREFIXES } from "@shared/utils/tags";
import { UrlForm } from "@features/urls/url-form";

interface EditUrlPageProps {
    shortCode: string;
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

        const formattedTags = [
            ...tags.map(t => formatTag(TAG_PREFIXES.CUSTOM, t)),
            formatTag(TAG_PREFIXES.CREATED_BY, userId)
        ];

        await shlink.updateShortUrl(shortCode, {
            longUrl,
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

    // Prepare initial data
    const initialData = {
        longUrl: shortUrlData.longUrl,
        tags: getDisplayTags(shortUrlData.tags),
        title: (shortUrlData as any).title, // Assuming title is in the response, though interface might need update
        customSlug: shortUrlData.shortCode, // Display shortCode as customSlug but disabled
        shortCodeLength: undefined, // Not editable
        validSince: (shortUrlData as any).meta?.validSince?.split("+")[0], // Format for datetime-local
        validUntil: (shortUrlData as any).meta?.validUntil?.split("+")[0],
        maxVisits: (shortUrlData as any).meta?.maxVisits,
        crawlable: (shortUrlData as any).crawlable,
        forwardQuery: (shortUrlData as any).forwardQuery,
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Short URL</h1>
            <UrlForm 
                availableTags={availableTags} 
                initialData={initialData} 
                action={updateUrl} 
                submitLabel="Save Changes" 
            />
        </div>
    );
}
