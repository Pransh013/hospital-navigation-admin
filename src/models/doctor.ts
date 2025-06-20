export interface Doctor {
  doctorId: string; // Partition Key
  name: string;
  designation: string;
  hospitalId: string; // GSI
  availability: "available" | "on-leave";
  createdAt: string;
  updatedAt: string;
}