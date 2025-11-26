import UrlsPage from "@views/url-list/ui/Page";

export const dynamic = "force-dynamic";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    return <UrlsPage searchParams={searchParams} />;
}
