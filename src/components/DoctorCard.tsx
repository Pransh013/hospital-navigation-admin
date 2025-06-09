import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/constants";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const availabilityColor =
    doctor.availability === "available" ? "text-green-800" : "text-red-700";

  return (
    <Card className="w-52 shadow-sm gap-3 py-4">
      <CardHeader>
        <CardTitle className="text-lg">{doctor.name}</CardTitle>
        <p className="text-sm ">{doctor.designation}</p>
      </CardHeader>
      <CardContent className="flex gap-1">
        <p className={`text-xs font-medium ${availabilityColor}`}>
          {doctor.availability === "available" ? "Available:" : "Unavailable:"}
        </p>
      </CardContent>
    </Card>
  );
}
