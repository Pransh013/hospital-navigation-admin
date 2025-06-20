import { Card } from "@/components/ui/card";
import Link from "next/link";
export type DoctorCardType = {
  doctorId?: string;
  name: string;
  designation: string;
  hospitalId?: string;
  availability: "available" | "on-leave";
  createdAt?: string;
  updatedAt?: string;
};

export default function DoctorCard({
  doctor,
  showEditButton = false,
}: {
  doctor: DoctorCardType;
  showEditButton: boolean;
}) {
  return (
    <Card
      key={doctor.doctorId}
      className="p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{doctor.name}</h3>
          <p className="text-sm text-muted-foreground">{doctor.designation}</p>
        </div>
        <div
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            doctor.availability === "available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {doctor.availability === "available" ? "Available" : "On Leave"}
        </div>
      </div>
      {showEditButton ? (
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <Link
            href={`/doctors/update/${doctor.doctorId}`}
            className="text-primary hover:underline"
          >
            Edit
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
