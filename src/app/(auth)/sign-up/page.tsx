import SignupForm from "@/components/forms/SignupForm";
import { getAllHospitalsAction } from "@/actions/hospital";

export default async function Signup() {
  const { success, data: hospitals, error } = await getAllHospitalsAction();
  if (!success || !hospitals) {
    throw new Error(error || "Could not load hospitals");
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm hospitals={hospitals} />
      </div>
    </div>
  );
}
