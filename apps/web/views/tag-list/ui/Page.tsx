import { shlink } from "@shared/utils/shlink";
import { TagListTable } from "@features/tags/tag-list-table";

export default async function TagsPage() {
    const data = await shlink.listTags();
    
    // Ensure stats exist (API might return empty stats object if no tags have stats)
    const stats = data.tags.stats || {};

    return (
        <div className="p-6">
             <h1 className="text-3xl font-bold mb-6">Manage tags</h1>
             <TagListTable tags={data.tags.data} stats={stats} />
        </div>
    );
}
