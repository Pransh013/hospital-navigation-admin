export type PatientTestStatus =
  | "assigned"
  | "test_completed"
  | "report_ready"
  | "consultation_scheduled"
  | "consultation_completed"
  | "cancelled";

export interface PatientTest {
  patientTestId: string; // Partition Key
  patientId: string; // GSI
  hospitalId: string; // GSI
  testId: string;
  status: PatientTestStatus;
  reportUrl?: string;
  reportUploadedAt?: string;
  doctorId?: string;
  consultationSlotId?: string;
  createdAt: string;
  updatedAt: string;
}
