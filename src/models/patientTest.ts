export type PatientTestStatus = "assigned" | "test_completed" | "cancelled";

export interface PatientTest {
  patientTestId: string; // Partition Key
  patientId: string; // GSI
  hospitalId: string; // GSI
  testId: string;
  status: PatientTestStatus;
  createdAt: string;
  updatedAt: string;
}
