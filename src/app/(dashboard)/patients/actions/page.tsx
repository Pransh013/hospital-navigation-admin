import PatientActions from "@/components/PatientActions";

export default async function PatientsActionsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Patient Actions</h1>
      <PatientActions />
    </div>
  );
}
