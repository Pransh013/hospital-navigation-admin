export type PatientTestStatus = "pending" | "assigned" | "completed";

export default interface PatientTest {
  patientTestId: string;
  patientId: string;
  testId: string;
  status: PatientTestStatus;
  createdAt: string;
  updatedAt: string;
}
