import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { listingUpdateSchema } from "@/lib/validators";

// Helper: accept numeric id or slug
async function findListing(idOrSlug: string) {
  const asNum = Number(idOrSlug);
  return prisma.listing.findFirst({
    where: isFinite(asNum)
      ? { id: asNum }
      : { slug: idOrSlug },
  });
}

// GET /api/listings/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = await findListing(id);
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    // Fields are now Json types, no need to parse
    const listingWithParsedData = {
      ...listing,
      images: listing.images || [],
      additionalSections: listing.additionalSections || [],
    };
    
    return NextResponse.json(listingWithParsedData);
  } catch (e) {
    console.error("GET /api/listings/[id] error", e);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

// PUT /api/listings/[id] – update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await findListing(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const data = listingUpdateSchema.parse(body);

    const updated = await prisma.listing.update({
      where: { id: existing.id },
      data: {
        ...data,
        images: data.images || undefined, // Pass as array directly
        additionalSections: data.additionalSections || undefined, // Pass as array directly
      },
    });

    return NextResponse.json({
      ...updated,
      images: updated.images || [], // Already an array
      additionalSections: updated.additionalSections || [], // Already an array
    });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: e.flatten() }, { status: 400 });
    }
    console.error("PUT /api/listings/[id] error", e);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

// DELETE /api/listings/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await findListing(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.listing.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/listings/[id] error", e);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
