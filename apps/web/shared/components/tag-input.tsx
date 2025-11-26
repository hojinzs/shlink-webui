"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@shared/components/badge";
import { Button } from "@shared/components/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@shared/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/components/popover";
import { cn } from "@shared/utils/utils";

interface TagInputProps {
    placeholder?: string;
    availableTags: string[];
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    onCreateTag?: (tag: string) => void;
}

export function TagInput({
    placeholder = "Select tags...",
    availableTags,
    selectedTags,
    onTagsChange,
    onCreateTag,
}: TagInputProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleSelect = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter((t) => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
        setOpen(false);
        setInputValue("");
    };

    const handleCreate = () => {
        if (inputValue && !availableTags.includes(inputValue)) {
            if (onCreateTag) {
                onCreateTag(inputValue);
            } else {
                // If no create handler, just add it to selection (assuming it will be created on submit)
                onTagsChange([...selectedTags, inputValue]);
            }
            setOpen(false);
            setInputValue("");
        }
    };

    const handleRemove = (tagToRemove: string) => {
        onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1">
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleRemove(tag)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {placeholder}
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search or create tag..."
                            value={inputValue}
                            onValueChange={setInputValue}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {inputValue && (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start font-normal"
                                        onClick={handleCreate}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create "{inputValue}"
                                    </Button>
                                )}
                                {!inputValue && "No tags found."}
                            </CommandEmpty>
                            <CommandGroup heading="Available Tags">
                                {availableTags
                                    .filter((tag) => !selectedTags.includes(tag))
                                    .map((tag) => (
                                        <CommandItem
                                            key={tag}
                                            value={tag}
                                            onSelect={() => handleSelect(tag)}
                                        >
                                            {tag}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
