import { getPatientsAction } from "@/actions/patient";
import PatientsList from "@/components/PatientsList";

export default async function PatientsPage() {
  const { success, data: patients, error } = await getPatientsAction();

  if (!success) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {error || "Failed to load patients"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-24">
      <PatientsList patients={patients || []} />
    </div>
  );
}
