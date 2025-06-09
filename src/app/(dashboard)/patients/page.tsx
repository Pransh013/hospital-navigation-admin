import { getPatientsAction } from "@/app/actions/patient";
import PatientsList from "@/components/PatientsList";

export default async function PatientsPage() {
  const patients = await getPatientsAction();

  if (!Array.isArray(patients)) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {patients.error || "Failed to load patients"}
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
