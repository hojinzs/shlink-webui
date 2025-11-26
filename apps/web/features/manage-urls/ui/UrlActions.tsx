"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Pencil } from "lucide-react";

interface UrlActionsProps {
    shortCode: string;
    qrCodeUrl: string;
    onDelete: (shortCode: string) => Promise<void>;
}

export function UrlActions({ shortCode, qrCodeUrl, onDelete }: UrlActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this short URL?")) return;

        setIsDeleting(true);
        try {
            await onDelete(shortCode);
        } catch (error) {
            alert("Failed to delete URL");
            setIsDeleting(false);
        }
    };

    const handleQrClick = () => {
        // Extract the short URL from the qrCodeUrl (which is like ".../qr-code")
        // Or better, just pass the shortUrl directly if available.
        // Looking at the usage in UrlListTable: qrCodeUrl={`${url.shortUrl}/qr-code`}
        // So we can strip "/qr-code" to get the shortUrl.
        const shortUrl = qrCodeUrl.replace(/\/qr-code$/, "");
        router.push(`/qr-code?url=${encodeURIComponent(shortUrl)}`);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleQrClick}
                className="text-gray-600 hover:text-blue-600"
                title="Generate QR Code"
            >
                <QrCode className="h-4 w-4" />
            </button>

            <button
                onClick={() => router.push(`/urls/${shortCode}/edit`)}
                className="text-gray-600 hover:text-blue-600"
                title="Edit URL"
            >
                <Pencil className="h-4 w-4" />
            </button>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                title="Delete URL"
            >
                {isDeleting ? "..." : "Delete"}
            </button>
        </div>
    );
}
