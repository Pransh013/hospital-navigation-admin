export default interface Doctor {
  doctorId: string;
  name: string;
  designation: string;
  hospitalId: string;
  availability: "available" | "on-leave";
  createdAt: string;
  updatedAt: string;
}