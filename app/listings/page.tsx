import Link from "next/link";

async function getListings() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/listings`, { cache: "no-store" });
  if (!res.ok) return { items: [], total: 0 };
  return res.json();
}

export default async function Page() {
  const { items: listings } = await getListings();

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Listings</h1>
        <Link href="/listings/add" className="btn btn-primary">
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No listings found.</p>
          <Link href="/listings/add" className="btn btn-primary mt-4">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.address}</p>
              {listing.price && (
                <p className="text-green-600 font-semibold mb-2">${listing.price.toLocaleString()}</p>
              )}
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{listing.description}</p>
              
              {listing.images && listing.images.length > 0 && (
                <div className="mb-4">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Link href={`/listings/${listing.id}/edit`} className="btn btn-secondary btn-sm">
                  Edit
                </Link>
                <Link href={`/listings/${listing.id}`} className="btn btn-outline btn-sm">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
