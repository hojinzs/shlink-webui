"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@shared/components/table";
import { Input } from "@shared/components/input";
import { Badge } from "@shared/components/badge";
import { CreateTagDialog } from "@features/tags/create-tag-dialog";
import { EditTagDialog } from "@features/tags/edit-tag-dialog";
import { getDisplayTags, isCustomTag } from "@shared/utils/tags";

interface TagStats {
    shortUrlsCount: number;
    visitsCount: number;
}

interface TagListTableProps {
    tags: string[];
    stats: Record<string, TagStats>;
}

export function TagListTable({ tags, stats }: TagListTableProps) {
    const [search, setSearch] = useState("");

    const filteredTags = tags.filter(tag => {
        if (!isCustomTag(tag)) return false;
        const displayTag = getDisplayTags([tag])[0] ?? tag;
        return displayTag.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <CreateTagDialog />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tag</TableHead>
                            <TableHead className="text-right">Short URLs</TableHead>
                            <TableHead className="text-right">Visits</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No tags found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTags.map((tag) => {
                                const displayTag = getDisplayTags([tag])[0] ?? tag;
                                const tagStats = stats[tag] || { shortUrlsCount: 0, visitsCount: 0 };
                                
                                return (
                                    <TableRow key={tag}>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-orange-600 text-white hover:bg-orange-700 border-none">
                                                {displayTag}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-blue-500 font-medium">
                                            {tagStats.shortUrlsCount}
                                        </TableCell>
                                        <TableCell className="text-right text-blue-500 font-medium">
                                            {tagStats.visitsCount}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <EditTagDialog tagName={displayTag} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
