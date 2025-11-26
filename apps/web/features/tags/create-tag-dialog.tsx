"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@shared/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@shared/components/dialog";
import { Input } from "@shared/components/input";
import { Label } from "@shared/components/label";
import { createTag } from "./actions";

export function CreateTagDialog() {
    const [open, setOpen] = useState(false);
    const [tagName, setTagName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagName) return;

        setIsSubmitting(true);
        try {
            await createTag(tagName);
            setOpen(false);
            setTagName("");
        } catch (error) {
            console.error("Failed to create tag:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tag
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Tag</DialogTitle>
                        <DialogDescription>
                            Create a new tag to organize your short URLs.
                            The "custom:" prefix will be added automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                className="col-span-3"
                                placeholder="marketing"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Tag"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
