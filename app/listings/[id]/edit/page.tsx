import ListingAddEdit from "@/components/ListingAddEdit";

async function getListing(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/listings/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  if (!listing) return <div className="p-4">Not found</div>;

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Listing</h1>
      <ListingAddEdit mode="edit" idOrSlug={params.id} initial={listing} />
    </main>
  );
}
