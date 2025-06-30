import { getTestsByHospitalAction } from "@/actions/test";
import { AddPackageForm } from "@/components/forms/AddPackageForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AddPackagePage() {
  const { data: tests } = await getTestsByHospitalAction();

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Package</CardTitle>
          <CardDescription>
            Create a new package by selecting from the available tests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddPackageForm tests={tests || []} />
        </CardContent>
      </Card>
    </div>
  );
}
