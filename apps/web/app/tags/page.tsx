import { shlink } from "@/lib/shlink";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
    const data = await shlink.listTags();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tags</h1>
            <div className="flex flex-wrap gap-2">
                {data.tags.data.map((tag) => (
                    <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
