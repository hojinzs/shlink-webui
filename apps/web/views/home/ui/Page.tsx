import { auth } from "@app/auth";
import { shlink } from "@shared/utils/shlink";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/card";
import { UrlListTable } from "@features/urls/ui/UrlListTable";
import Link from "next/link";
import { Button } from "@shared/components/button";
import { Input } from "@shared/components/input";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formatTag, TAG_PREFIXES } from "@shared/utils/tags";

export default async function HomePage() {
  const session = await auth();

  let stats = { 
    visits: 0, 
    orphanVisits: 0, 
    shortUrls: 0, 
    tags: 0 
  };
  let recentUrls: any[] = [];

  try {
    const [urlsData, visitsData, orphanVisitsData, tagsData] = await Promise.all([
      shlink.listShortUrls(1, 5),
      shlink.getVisits(),
      shlink.getOrphanVisits(),
      shlink.listTags()
    ]);

    stats.shortUrls = urlsData?.shortUrls?.pagination?.totalItems || 0;
    stats.visits = visitsData?.visits?.nonOrphanVisits?.total || 0;
    stats.orphanVisits = orphanVisitsData?.visits?.pagination?.totalItems || 0;
    stats.tags = tagsData?.tags?.data?.filter(tag => tag.startsWith("custom:"))?.length || 0;

    recentUrls = urlsData?.shortUrls?.data || [];

  } catch (e) {
    console.error("Failed to fetch stats", e);
  }

  async function createUrl(formData: FormData) {
    "use server";
    const longUrl = formData.get("longUrl") as string;
    const customSlug = formData.get("customSlug") as string;
    const tagsInput = formData.get("tags") as string;

    if (!longUrl) return;

    const session = await auth();
    const userId = session?.user?.email || session?.user?.name || "unknown";

    const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const formattedTags = [
        ...tags.map(t => formatTag(TAG_PREFIXES.CUSTOM, t)),
        formatTag(TAG_PREFIXES.CREATED_BY, userId)
    ];

    await shlink.createShortUrl(longUrl, formattedTags, { customSlug: customSlug || undefined });
    revalidatePath("/");
    revalidatePath("/urls");
  }

  async function deleteUrl(shortCode: string) {
    "use server";
    await shlink.deleteShortUrl(shortCode);
    revalidatePath("/");
    revalidatePath("/urls");
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VISITS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ORPHAN VISITS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orphanVisits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SHORT URLS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shortUrls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TAGS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tags}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Short URL Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create a short URL</CardTitle>
          <Link href="/urls/create" className="text-sm text-blue-600 hover:underline">
            Advanced options »
          </Link>
        </CardHeader>
        <CardContent>
          <form action={createUrl} className="space-y-4">
            <Input 
              name="longUrl" 
              placeholder="URL to be shortened" 
              required 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                name="customSlug" 
                placeholder="Custom slug" 
              />
              <Input 
                name="tags" 
                placeholder="Add tags to the URL (comma separated)" 
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recently Created URLs Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently created URLs</CardTitle>
          <Link href="/urls" className="text-sm text-blue-600 hover:underline">
            See all »
          </Link>
        </CardHeader>
        <CardContent>
          <UrlListTable shortUrls={recentUrls} onDelete={deleteUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
