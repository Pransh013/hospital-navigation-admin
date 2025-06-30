import { getPackagesAction } from "@/actions/package";
import { getTestsByHospitalAction } from "@/actions/test";
import AddPatientForm from "@/components/forms/AddPatientForm";

export default async function AddPatientPage() {
  const [testsResponse, packagesResponse] = await Promise.all([
    getTestsByHospitalAction(),
    getPackagesAction(),
  ]);

  if (!testsResponse.success || !packagesResponse.success) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {testsResponse.error ||
            packagesResponse.error ||
            "Failed to load data"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add New Patient</h1>
      <AddPatientForm
        tests={testsResponse.data || []}
        packages={packagesResponse.data || []}
      />
    </div>
  );
}
