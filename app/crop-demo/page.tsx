"use client";

import { useMemo, useState } from "react";
import CropperImage from "@/components/CropperImage";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  const objUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setCroppedUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }

  async function handleCropped(blob: Blob) {
    // Show local preview
    const url = URL.createObjectURL(blob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);

    // (Optional) Upload to your API
    // const form = new FormData();
    // form.append("file", new File([blob], "crop.jpg", { type: blob.type }));
    // await fetch("/api/upload", { method: "POST", body: form });
  }

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Cropper.js Demo</h1>

      <div>
        <input type="file" accept="image/*" onChange={onFile} />
      </div>

      {objUrl && (
        <CropperImage
          src={objUrl}
          aspect={4 / 3}          // set 16/9 or 1/1 as needed
          outputWidth={1200}
          outputHeight={900}
          onCropped={(blob) => {
            handleCropped(blob);
            setCroppedUrl("blob://local"); // placeholder to show something changed
          }}
        />
      )}

      {previewUrl && (
        <section>
          <h2 className="text-lg font-medium mb-2">Cropped Preview</h2>
          <img src={previewUrl} alt="Cropped" className="rounded border max-w-full" />
        </section>
      )}
    </main>
  );
}
