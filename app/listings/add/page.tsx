import ListingAddEdit from "@/components/ListingAddEdit";

export default function Page() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add Listing</h1>
      <ListingAddEdit mode="create" />
    </main>
  );
}
