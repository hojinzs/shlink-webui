import { shlink } from "@shared/utils/shlink";
import Link from "next/link";
import { UrlActions } from "@features/manage-urls/ui/UrlActions";
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

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Short URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Long URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Visits
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.shortUrls.data.map((url) => (
                            <tr key={url.shortCode}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={url.shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                        {url.shortUrl}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                    {url.longUrl}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {url.visitsSummary?.total || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(url.dateCreated).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <UrlActions
                                        shortCode={url.shortCode}
                                        qrCodeUrl={shlink.getQrCodeUrl(url.shortCode)}
                                        onDelete={deleteUrl}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
