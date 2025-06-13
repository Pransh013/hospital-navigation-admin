export type PatientTestStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled";

export default interface PatientTest {
  patientTestId: string;
  patientId: string;
  testId: string;
  status: PatientTestStatus;
  reportUrl?: string;
  reportUploadedAt?: string;
  doctorId?: string;
  doctorAssignedAt?: string;
  createdAt: string;
  updatedAt: string;
}
