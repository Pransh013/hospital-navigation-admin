import SignupForm from "@/components/SignupForm";
import { getAllHospitalsAction } from "@/app/actions/hospital";

export default async function Signup() {
  const result = await getAllHospitalsAction();
  if (!result.success || !result.hospitals) {
    throw new Error(result.error || "Could not load hospitals");
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm hospitals={result.hospitals} />
      </div>
    </div>
  );
}
