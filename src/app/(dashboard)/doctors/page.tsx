import { getDoctorsAction } from "@/app/actions/doctor";
import DoctorsList from "@/components/DoctorsList";

export default async function DoctorsPage() {
  const { success, doctors, error } = await getDoctorsAction();

  if (!success) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {error || "Failed to load doctors"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-24">
      <DoctorsList doctors={doctors || []} />
    </div>
  );
}
