import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { listingSchema } from "@/lib/validators";

// GET /api/listings  – list (simple pagination)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "12"), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.listing.count(),
    ]);

    // Parse JSON fields for SQLite compatibility
    const itemsWithParsedData = items.map(item => ({
      ...item,
      images: JSON.parse(item.images),
    }));

    return NextResponse.json({ items: itemsWithParsedData, page, limit, total });
  } catch (e) {
    console.error("GET /api/listings error", e);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// POST /api/listings  – create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = listingSchema.parse(body);

    // Basic unique slug (adjust to your needs)
    const base = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = base || `listing-${Date.now()}`;

    const created = await prisma.listing.create({
      data: { 
        ...data, 
        slug,
        images: JSON.stringify(data.images),
      },
    });

    return NextResponse.json({
      ...created,
      images: data.images,
    }, { status: 201 });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: e.flatten() }, { status: 400 });
    }
    console.error("POST /api/listings error", e);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
