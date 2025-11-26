"use client";

import { useState } from "react";
import Image from "next/image";

interface UrlActionsProps {
    shortCode: string;
    qrCodeUrl: string;
    onDelete: (shortCode: string) => Promise<void>;
}

export function UrlActions({ shortCode, qrCodeUrl, onDelete }: UrlActionsProps) {
    const [showQr, setShowQr] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <div className="flex items-center space-x-2">
            <div className="relative">
                <button
                    onClick={() => setShowQr(!showQr)}
                    className="text-gray-600 hover:text-blue-600"
                    title="Show QR Code"
                >
                    QR
                </button>
                {showQr && (
                    <div className="absolute right-0 top-full mt-2 p-2 bg-white shadow-lg rounded border z-10">
                        <Image src={qrCodeUrl} alt="QR Code" width={150} height={150} unoptimized />
                    </div>
                )}
            </div>

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
