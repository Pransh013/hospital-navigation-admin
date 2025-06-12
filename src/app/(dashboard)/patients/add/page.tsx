import { getTestsByHospitalAction } from "@/actions/test";
import AddPatientForm from "@/components/forms/AddPatientForm";


export default async function AddPatientPage() {
  const { success, data: tests, error } = await getTestsByHospitalAction();

  if (!success) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {error || "Failed to load tests"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add New Patient</h1>
      <AddPatientForm tests={tests || []} />
    </div>
  );
}
