"use server";

import { shlink } from "@shared/utils/shlink";
import { formatTag, TAG_PREFIXES } from "@shared/utils/tags";
import { revalidatePath } from "next/cache";

export async function createTag(tagName: string) {
    if (!tagName) return;

    const formattedTag = formatTag(TAG_PREFIXES.CUSTOM, tagName);
    await shlink.createTags([formattedTag]);
    revalidatePath("/tags");
    revalidatePath("/urls/create");
}

export async function renameTag(oldName: string, newName: string) {
    if (!oldName || !newName) return;

    const formattedOldName = formatTag(TAG_PREFIXES.CUSTOM, oldName);
    const formattedNewName = formatTag(TAG_PREFIXES.CUSTOM, newName);

    await shlink.renameTag(formattedOldName, formattedNewName);
    revalidatePath("/tags");
    revalidatePath("/urls");
}

export async function deleteTag(tagName: string) {
    if (!tagName) return;

    const formattedTag = formatTag(TAG_PREFIXES.CUSTOM, tagName);
    await shlink.deleteTags([formattedTag]);
    revalidatePath("/tags");
    revalidatePath("/urls");
    revalidatePath("/urls/create");
}
