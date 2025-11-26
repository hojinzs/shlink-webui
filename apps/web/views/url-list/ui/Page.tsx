import { shlink } from "@shared/utils/shlink";
import Link from "next/link";
import { UrlActions } from "@features/manage-urls/ui/UrlActions";
import { UrlListTable } from "@features/urls/ui/UrlListTable";
import { revalidatePath } from "next/cache";

export default async function UrlsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const page = Number((await searchParams).page) || 1;
    const data = await shlink.listShortUrls(page);

    async function deleteUrl(shortCode: string) {
        "use server";
        await shlink.deleteShortUrl(shortCode);
        revalidatePath("/urls");
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Short URLs</h1>
                <Link
                    href="/urls/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create URL
                </Link>
            </div>

            <UrlListTable 
                shortUrls={data.shortUrls.data} 
                onDelete={deleteUrl} 
            />

            <div className="mt-4 flex justify-between items-center">
                <div>
                    Page {data.shortUrls.pagination.currentPage} of {data.shortUrls.pagination.pagesCount}
                </div>
                <div className="space-x-2">
                    {page > 1 && (
                        <Link
                            href={`/urls?page=${page - 1}`}
                            className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                            Previous
                        </Link>
                    )}
                    {page < data.shortUrls.pagination.pagesCount && (
                        <Link
                            href={`/urls?page=${page + 1}`}
                            className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
