import { shlink } from "@shared/utils/shlink";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@app/auth";
import { formatTag, getDisplayTags, TAG_PREFIXES } from "@shared/utils/tags";
import { CreateUrlForm } from "@features/urls/create-url-form";

export default async function CreateUrlPage() {
    const tagsData = await shlink.listTags();
    const availableTags = getDisplayTags(tagsData.tags.data);

    async function createUrl(formData: FormData) {
        "use server";
        const longUrl = formData.get("longUrl") as string;
        const customSlug = formData.get("customSlug") as string;
        const tags = formData.getAll("tags") as string[];

        if (!longUrl) return;

        const session = await auth();
        const userId = session?.user?.email || session?.user?.name || "unknown";

        const formattedTags = [
            ...tags.map(t => formatTag(TAG_PREFIXES.CUSTOM, t)),
            formatTag(TAG_PREFIXES.CREATED_BY, userId)
        ];

        await shlink.createShortUrl(longUrl, formattedTags, customSlug || undefined);
        revalidatePath("/urls");
        redirect("/urls");
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create Short URL</h1>
            <CreateUrlForm availableTags={availableTags} createUrlAction={createUrl} />
        </div>
    );
}
