import { v4 as uuidv4 } from "uuid";
import { patientTestRepository } from "@/repositories/patientTestRepository";
import PatientTest from "@/models/patientTest";

export const patientTestService = {
  assignTests: async (testIds: string[], patientId: string): Promise<void> => {
    const now = new Date().toISOString();

    const patientTestRecords: PatientTest[] = testIds.map((testId) => ({
      patientTestId: uuidv4(),
      patientId,
      testId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }));

    await patientTestRepository.createMany(patientTestRecords);
  },

  getPatientTests: async (patientId: string): Promise<PatientTest[]> => {
    return patientTestRepository.findByPatientId(patientId);
  },

  removeTest: async (patientId: string, testId: string): Promise<void> => {
    await patientTestRepository.delete(patientId, testId);
  },
};
