export interface Patient {
  patientId: string; // Partition Key
  firstName: string;
  lastName: string;
  email: string; // GSI
  passwordHash: string;
  gender: "male" | "female" | "other";
  contactNumber: string;
  address: string;
  hospitalId: string; // GSI
  createdAt: string;
  updatedAt: string;
}
