import { getPackagesAction } from "@/actions/package";
import PackagesList from "@/components/PackagesList";

export default async function PackagesPage() {
  const { success, data: packages, error } = await getPackagesAction();

  if (!success) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {error || "Failed to load packages"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-24">
      <PackagesList packages={packages || []} />
    </div>
  );
}
