"use client";

import { useState } from "react";
import { TagInput } from "@shared/components/tag-input";
import { Button } from "@shared/components/button";
import { Input } from "@shared/components/input";
import { Label } from "@shared/components/label";

interface CreateUrlFormProps {
    availableTags: string[];
    createUrlAction: (formData: FormData) => Promise<void>;
}

export function CreateUrlForm({ availableTags, createUrlAction }: CreateUrlFormProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        // Append tags to formData
        selectedTags.forEach(tag => formData.append("tags", tag));
        await createUrlAction(formData);
        setIsSubmitting(false);
    };

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
                <Label htmlFor="longUrl">Long URL</Label>
                <Input
                    type="url"
                    name="longUrl"
                    id="longUrl"
                    required
                    className="mt-1"
                    placeholder="https://example.com/very/long/url"
                />
            </div>

            <div>
                <Label htmlFor="customSlug">Custom Slug (Optional)</Label>
                <Input
                    type="text"
                    name="customSlug"
                    id="customSlug"
                    className="mt-1"
                    placeholder="custom-alias"
                />
            </div>

            <div>
                <Label>Tags</Label>
                <div className="mt-1">
                    <TagInput
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                        placeholder="Select or create tags..."
                    />
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Short URL"}
                </Button>
            </div>
        </form>
    );
}
