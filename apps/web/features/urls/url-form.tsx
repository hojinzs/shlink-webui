"use client";

import { useState } from "react";
import { TagInput } from "@shared/components/tag-input";
import { Button } from "@shared/components/button";
import { Input } from "@shared/components/input";
import { Label } from "@shared/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/card";
import { Separator } from "@shared/components/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UtmBuilder } from "@shared/components/utm-builder";
import { UtmParameters, utmParametersToTags, validateUtmValue } from "@shared/utils/tags";

interface UrlFormProps {
    availableTags: string[];
    initialData?: {
        longUrl: string;
        tags: string[];
        title?: string;
        customSlug?: string;
        shortCodeLength?: number;
        domain?: string;
        validSince?: string;
        validUntil?: string;
        maxVisits?: number;
        crawlable?: boolean;
        forwardQuery?: boolean;
        utmParams?: UtmParameters;
    };
    action: (formData: FormData) => Promise<void>;
    onDelete?: () => Promise<void>;
    submitLabel?: string;
}

export function UrlForm({ availableTags, initialData, action, onDelete, submitLabel = "Save" }: UrlFormProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(!!initialData);
    const [showUtmBuilder, setShowUtmBuilder] = useState(
        !!initialData?.utmParams && Object.values(initialData.utmParams).some(v => v)
    );
    const [utmParams, setUtmParams] = useState<UtmParameters>(initialData?.utmParams || {});
    const [longUrl, setLongUrl] = useState(initialData?.longUrl || '');

    const hasUtmErrors = Object.values(utmParams).some(value => {
        if (!value) return false;
        return !validateUtmValue(value).valid;
    });

    const handleSubmit = async (formData: FormData) => {
        if (hasUtmErrors) {
            // Prevent submission when UTM parameters are invalid.
            // UTM fields should already display inline validation errors.
            return;
        }

        setIsSubmitting(true);
        // Append tags to formData
        selectedTags.forEach(tag => formData.append("tags", tag));
        
        // Append UTM parameters as separate form fields
        const utmTags = utmParametersToTags(utmParams);
        utmTags.forEach(tag => formData.append("utmTags", tag));

        try {
            await action(formData);
        } catch (error) {
            console.error("Failed to save URL", error);
            // Ideally show a toast here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        if (!confirm("Are you sure you want to delete this short URL?")) return;

        setIsDeleting(true);
        try {
            await onDelete();
        } catch (error) {
            console.error("Failed to delete URL", error);
            alert("Failed to delete URL");
            setIsDeleting(false);
        }
    };

    const isEditMode = !!initialData;

    return (
        <form action={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Main options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="longUrl">URL to be shortened</Label>
                        <Input
                            type="url"
                            name="longUrl"
                            id="longUrl"
                            required
                            className="mt-1"
                            placeholder="https://example.com/very/long/url"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Add tags to the URL</Label>
                        <div className="mt-1">
                            <TagInput
                                availableTags={availableTags}
                                selectedTags={selectedTags}
                                onTagsChange={setSelectedTags}
                                placeholder="Select or create tags..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUtmBuilder(!showUtmBuilder)}
                    className="text-muted-foreground"
                >
                    {showUtmBuilder ? (
                        <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Hide UTM parameters
                        </>
                    ) : (
                        <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Add UTM parameters
                        </>
                    )}
                </Button>
            </div>

            {showUtmBuilder && (
                <UtmBuilder
                    longUrl={longUrl}
                    utmParams={utmParams}
                    onUtmParamsChange={setUtmParams}
                />
            )}

            <div className="flex justify-center">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-muted-foreground"
                >
                    {showAdvanced ? (
                        <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Hide advanced options
                        </>
                    ) : (
                        <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Show advanced options
                        </>
                    )}
                </Button>
            </div>

            {showAdvanced && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Customize the short URL</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="mt-1"
                                    placeholder="Descriptive title"
                                    defaultValue={initialData?.title}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customSlug">Custom slug</Label>
                                    <Input
                                        type="text"
                                        name="customSlug"
                                        id="customSlug"
                                        className="mt-1"
                                        placeholder="custom-alias"
                                        defaultValue={initialData?.customSlug}
                                        disabled={isEditMode}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shortCodeLength">Short code length</Label>
                                    <Input
                                        type="number"
                                        name="shortCodeLength"
                                        id="shortCodeLength"
                                        className="mt-1"
                                        min={4}
                                        placeholder="Default"
                                        defaultValue={initialData?.shortCodeLength}
                                        disabled={isEditMode}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Limit access to the short URL</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="validSince">Enabled since</Label>
                                    <Input
                                        type="datetime-local"
                                        name="validSince"
                                        id="validSince"
                                        className="mt-1"
                                        defaultValue={initialData?.validSince}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="validUntil">Enabled until</Label>
                                    <Input
                                        type="datetime-local"
                                        name="validUntil"
                                        id="validUntil"
                                        className="mt-1"
                                        defaultValue={initialData?.validUntil}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="maxVisits">Maximum visits allowed</Label>
                                <Input
                                    type="number"
                                    name="maxVisits"
                                    id="maxVisits"
                                    className="mt-1"
                                    min={1}
                                    placeholder="Unlimited"
                                    defaultValue={initialData?.maxVisits}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {!isEditMode && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Extra checks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="findIfExists"
                                        id="findIfExists"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="findIfExists" className="font-normal">
                                        Use existing URL if found
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Configure behavior</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="crawlable"
                                    id="crawlable"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    defaultChecked={initialData?.crawlable}
                                />
                                <Label htmlFor="crawlable" className="font-normal">
                                    Make it crawlable
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="forwardQuery"
                                    id="forwardQuery"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    defaultChecked={initialData?.forwardQuery ?? true}
                                />
                                <Label htmlFor="forwardQuery" className="font-normal">
                                    Forward query params on redirect
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="pt-4 sticky bottom-0 bg-background pb-4 border-t mt-8 flex items-center justify-between gap-4">
                {onDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting || isSubmitting}
                    >
                        {isDeleting ? "Deleting..." : "Delete URL"}
                    </Button>
                )}
                <Button
                    type="submit"
                    className="w-full md:w-auto md:min-w-[200px]"
                    disabled={isSubmitting || isDeleting}
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
