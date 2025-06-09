export default interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  gender: "male" | "female" | "other";
  contactNumber: string;
  address: string;
  hospitalId: string;
  createdAt: string;
  updatedAt: string;
}
