import { getTestsByHospitalAction } from "@/actions/test";
import UpdatePatientForm from "@/components/forms/UpdatePatientForm";

export default async function UpdatePatientPage() {
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
      <h1 className="text-xl font-bold mb-4">Update Patient</h1>
      <UpdatePatientForm tests={tests || []} />
    </div>
  );
}
