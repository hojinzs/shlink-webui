"use client";

import * as React from "react";
import { Input } from "@shared/components/input";
import { Label } from "@shared/components/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/components/card";
import { Badge } from "@shared/components/badge";
import { AlertCircle, Eye, Tag } from "lucide-react";
import { 
    UtmParameters, 
    validateUtmValue, 
    buildUrlWithUtmParams,
    utmParametersToTags 
} from "@shared/utils/tags";

interface UtmBuilderProps {
    longUrl: string;
    utmParams: UtmParameters;
    onUtmParamsChange: (params: UtmParameters) => void;
}

interface UtmFieldConfig {
    key: keyof UtmParameters;
    label: string;
    placeholder: string;
    description: string;
}

const UTM_FIELDS: UtmFieldConfig[] = [
    {
        key: "utm_source",
        label: "Campaign Source",
        placeholder: "e.g., google, newsletter, facebook",
        description: "Identifies which site sent the traffic (required for tracking)"
    },
    {
        key: "utm_medium",
        label: "Campaign Medium",
        placeholder: "e.g., cpc, banner, email",
        description: "Identifies what type of link was used"
    },
    {
        key: "utm_campaign",
        label: "Campaign Name",
        placeholder: "e.g., summer-sale, product-launch",
        description: "Identifies a specific product promotion or campaign"
    },
    {
        key: "utm_term",
        label: "Campaign Term",
        placeholder: "e.g., running+shoes",
        description: "Identifies search terms (optional)"
    },
    {
        key: "utm_content",
        label: "Campaign Content",
        placeholder: "e.g., logolink, textlink",
        description: "Identifies what specifically was clicked (optional)"
    }
];

export function UtmBuilder({ longUrl, utmParams, onUtmParamsChange }: UtmBuilderProps) {
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleChange = (key: keyof UtmParameters, value: string) => {
        const validation = validateUtmValue(value);
        
        setErrors(prev => {
            const newErrors = { ...prev };
            if (validation.valid) {
                delete newErrors[key];
            } else {
                newErrors[key] = validation.error || 'Invalid value';
            }
            return newErrors;
        });

        onUtmParamsChange({
            ...utmParams,
            [key]: value
        });
    };

    const previewUrl = buildUrlWithUtmParams(longUrl, utmParams);
    const hasAnyUtmParam = Object.values(utmParams).some(v => v && v.trim());
    const generatedTags = utmParametersToTags(utmParams);
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    UTM Parameter Builder
                </CardTitle>
                <CardDescription>
                    Add UTM parameters to track campaign performance. Parameters will be saved as tags.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {UTM_FIELDS.map((field) => (
                    <div key={field.key}>
                        <Label htmlFor={field.key} className="text-sm font-medium">
                            {field.label}
                        </Label>
                        <Input
                            type="text"
                            id={field.key}
                            name={field.key}
                            className={`mt-1 ${errors[field.key] ? 'border-red-500' : ''}`}
                            placeholder={field.placeholder}
                            value={utmParams[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {field.description}
                        </p>
                        {errors[field.key] && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors[field.key]}
                            </p>
                        )}
                    </div>
                ))}

                {hasAnyUtmParam && !hasErrors && (
                    <div className="mt-6 space-y-4">
                        <div className="p-3 bg-muted rounded-md">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Eye className="h-4 w-4" />
                                URL Preview
                            </div>
                            <p className="text-xs text-muted-foreground break-all font-mono">
                                {previewUrl}
                            </p>
                        </div>

                        <div className="p-3 bg-muted rounded-md">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Tag className="h-4 w-4" />
                                Tags to be created
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {generatedTags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {hasErrors && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Please fix the validation errors above before proceeding.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
