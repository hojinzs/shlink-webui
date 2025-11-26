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
