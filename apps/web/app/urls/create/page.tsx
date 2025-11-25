import { shlink } from "@/lib/shlink";
import { redirect } from "next/navigation";

export default function CreateUrlPage() {
    async function createUrl(formData: FormData) {
        "use server";
        const longUrl = formData.get("longUrl") as string;
        const customSlug = formData.get("customSlug") as string;

        if (!longUrl) return;

        await shlink.createShortUrl(longUrl, [], customSlug || undefined);
        redirect("/urls");
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create Short URL</h1>
            <form action={createUrl} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700">
                        Long URL
                    </label>
                    <input
                        type="url"
                        name="longUrl"
                        id="longUrl"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder="https://example.com/very/long/url"
                    />
                </div>

                <div>
                    <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700">
                        Custom Slug (Optional)
                    </label>
                    <input
                        type="text"
                        name="customSlug"
                        id="customSlug"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder="custom-alias"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Create Short URL
                    </button>
                </div>
            </form>
        </div>
    );
}
