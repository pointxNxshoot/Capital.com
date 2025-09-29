import Link from "next/link";
import GoogleMap from "@/components/GoogleMap";
import PublicAdditionalMaterials from "@/components/PublicAdditionalMaterials";

async function getListing(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/listings/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  if (!listing) return <div className="p-4">Listing not found</div>;

  return (
    <main className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/listings" className="text-blue-600 hover:underline">
            ← Back to Listings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
            
            {listing.price && (
              <p className="text-2xl font-semibold text-green-600 mb-4">
                ${listing.price.toLocaleString()}
              </p>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Address</h3>
                <p>{listing.address}</p>
                {listing.suburb && <p>{listing.suburb}</p>}
                {listing.state && listing.postcode && (
                  <p>{listing.state} {listing.postcode}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p>Lat: {listing.latitude}, Lng: {listing.longitude}</p>
              </div>

              {/* Map Section */}
              {listing.latitude && listing.longitude && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Map</h3>
                  <GoogleMap
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                    companyName={listing.title}
                    address={listing.address}
                    className="w-full h-64 rounded-lg"
                  />
                </div>
              )}

              {listing.description && (
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Link href={`/listings/${listing.id}/edit`} className="btn btn-primary">
                Edit Listing
              </Link>
            </div>
          </div>

          <div>
            {listing.images && listing.images.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Photos</h3>
                <div className="grid grid-cols-1 gap-4">
                  {listing.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${listing.title} - Photo ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No photos available</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Materials Section */}
        {listing.additionalSections && listing.additionalSections.length > 0 && (
          <div className="mt-8">
            <PublicAdditionalMaterials sections={listing.additionalSections} />
          </div>
        )}
      </div>
    </main>
  );
}