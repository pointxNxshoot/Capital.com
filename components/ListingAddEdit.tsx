"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { listingSchema, listingUpdateSchema } from "@/lib/validators";

type CreateInput = z.infer<typeof listingSchema>;
type UpdateInput = z.infer<typeof listingUpdateSchema>;

type Props =
  | { mode: "create"; initial?: Partial<CreateInput> }
  | { mode: "edit"; idOrSlug: string; initial: CreateInput };

export default function ListingAddEdit(props: Props) {
  const isEdit = props.mode === "edit";
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CreateInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: isEdit ? (props as any).initial : (props.initial || {
      title: "",
      description: "",
      address: "",
      latitude: -27.4698,
      longitude: 153.0251,
      images: [],
    }),
  });

  // optional: keep lat/lng as numbers
  useEffect(() => {
    const sub = form.watch((vals, { name }) => {
      if (name === "latitude" || name === "longitude") {
        const v = vals[name as "latitude" | "longitude"];
        if (typeof v === "string") {
          const n = Number(v);
          if (!Number.isNaN(n)) form.setValue(name as any, n as any, { shouldDirty: true });
        }
      }
    });
    return () => sub.unsubscribe?.();
  }, [form]);

  async function onSubmit(values: CreateInput) {
    try {
      setSubmitting(true);

      const res = await fetch(isEdit ? `/api/listings/${(props as any).idOrSlug}` : "/api/listings", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || res.statusText);
      }

      // success – you might redirect or toast here
      alert(isEdit ? "Listing updated" : "Listing created");
    } catch (e: any) {
      alert(e.message || "Failed to save listing");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input className="input" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Price (optional)</label>
        <input type="number" className="input" {...form.register("price", { valueAsNumber: true })} />
        {form.formState.errors.price && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input className="input" {...form.register("address")} />
        {form.formState.errors.address && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Suburb</label>
          <input className="input" {...form.register("suburb")} />
        </div>
        <div>
          <label className="block text-sm font-medium">State</label>
          <input className="input" {...form.register("state")} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Postcode</label>
        <input className="input" {...form.register("postcode")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input type="number" step="any" className="input" {...form.register("latitude", { valueAsNumber: true })} />
          {form.formState.errors.latitude && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.latitude.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input type="number" step="any" className="input" {...form.register("longitude", { valueAsNumber: true })} />
          {form.formState.errors.longitude && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea rows={5} className="input" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Simple image URL input list; replace with your uploader */}
      <ImageUrlList control={form} />

      <div className="pt-2">
        <button disabled={submitting} className="btn btn-primary">
          {submitting ? "Saving..." : isEdit ? "Update Listing" : "Create Listing"}
        </button>
      </div>
    </form>
  );
}

function ImageUrlList({ control }: { control: any }) {
  const images: string[] = control.getValues("images") || [];
  const [url, setUrl] = useState("");

  function add() {
    if (!url) return;
    control.setValue("images", [...images, url], { shouldDirty: true });
    setUrl("");
  }
  function remove(i: number) {
    control.setValue("images", images.filter((_, idx) => idx !== i), { shouldDirty: true });
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Photos (URLs)</label>
      <div className="flex gap-2">
        <input className="input flex-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        <button type="button" className="btn btn-secondary" onClick={add}>Add</button>
      </div>
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-2">
          {images.map((u, i) => (
            <li key={i} className="border rounded p-2 flex items-center gap-2">
              <img src={u} alt="" className="h-12 w-12 object-cover rounded" />
              <span className="truncate">{u}</span>
              <button type="button" className="ml-auto text-red-600" onClick={() => remove(i)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
