export type TestStatusType = "active" | "closed" | "on-break";

export default interface TestStatus {
  testId: string;
  hospitalId: string;
  status: TestStatusType;
  patientsWaiting: number;
  updatedAt: string;
}
