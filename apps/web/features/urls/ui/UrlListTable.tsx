"use client";

import { UrlActions } from "@features/manage-urls/ui/UrlActions";
import { ShortUrl } from "@shared/utils/shlink";
import { Badge } from "@shared/components/badge";
import { getDisplayTags } from "@shared/utils/tags";

interface UrlListTableProps {
    shortUrls: ShortUrl[];
    onDelete: (shortCode: string) => Promise<void>;
}

export function UrlListTable({ shortUrls, onDelete }: UrlListTableProps) {
    return (
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
                            Tags
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
                    {shortUrls.map((url) => (
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
                                <div className="flex flex-wrap gap-1">
                                    {getDisplayTags(url.tags).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
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
                                    qrCodeUrl={`${url.shortUrl}/qr-code`} 
                                    onDelete={onDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
