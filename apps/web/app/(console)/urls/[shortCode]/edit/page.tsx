import EditUrlPage from "@views/url-edit/ui/Page";

interface PageProps {
    params: Promise<{ shortCode: string }>;
}

export default async function Page({ params }: PageProps) {
    const { shortCode } = await params;
    return <EditUrlPage shortCode={shortCode} />;
}
