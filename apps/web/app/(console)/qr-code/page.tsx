"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCodeStyling, {
  ErrorCorrectionLevel,
} from "qr-code-styling";
import { Button } from "@shared/components/button";
import { Input } from "@shared/components/input";
import { Label } from "@shared/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/card";

function QrCodeGenerator() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";
  const [url, setUrl] = useState(initialUrl);
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(0);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>("L");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      type: "canvas",
      data: url,
      image: logo,
      dotsOptions: {
        color: color,
        type: "square",
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
      },
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
      },
    });
    setQrCode(qr);
  }, []);

  useEffect(() => {
    if (qrCode && ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update({
      width: size,
      height: size,
      data: url,
      image: logo,
      dotsOptions: {
        color: color,
      },
      backgroundOptions: {
        color: bgColor,
      },
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
      },
      imageOptions: {
        margin: margin,
      }
    });
  }, [qrCode, url, size, margin, errorCorrection, color, bgColor, logo]);

  const handleDownload = async () => {
    if (!qrCode) return;
    
    try {
      qrCode.download({
        name: "qr-code",
        extension: "png",
      });
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">QR Code Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Size: {size}px</Label>
              <input
                type="range"
                min="100"
                max="1000"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Margin: {margin}px</Label>
              <input
                type="range"
                min="0"
                max="50"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Error Correction</Label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                className="w-full p-2 border rounded-md"
              >
                <option value="L">Low (L)</option>
                <option value="M">Medium (M)</option>
                <option value="Q">Quartile (Q)</option>
                <option value="H">High (H)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Foreground</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 p-1 rounded border"
                  />
                  <span className="text-sm text-gray-500">{color}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-10 p-1 rounded border"
                  />
                  <span className="text-sm text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={handleLogoUpload} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div
              ref={ref}
              className="border p-4 rounded-lg bg-white shadow-sm w-full [&>canvas]:w-full [&>canvas]:h-auto"
              style={{ minHeight: "300px" }}
            />
            <Button onClick={handleDownload} className="w-full max-w-xs">
              Download PNG
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function QrCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QrCodeGenerator />
    </Suspense>
  );
}
