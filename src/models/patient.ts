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
  bookingDate: string;
  reportUrl?: string;
  reportUploadedAt?: string;
  consultationRequired?: boolean;
  consultationSlotId?: string;
  doctorId?: string;
  createdAt: string;
  updatedAt: string;
}
