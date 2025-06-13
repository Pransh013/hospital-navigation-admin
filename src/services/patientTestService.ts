import { v4 as uuidv4 } from "uuid";
import { patientTestRepository } from "@/repositories/patientTestRepository";
import { testStatusService } from "@/services/testStatusService";
import { getCurrentAdminAction } from "@/actions/admin";
import PatientTest from "@/models/patientTest";

export const patientTestService = {
  assignTests: async (testIds: string[], patientId: string): Promise<void> => {
    const now = new Date().toISOString();

    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      throw new Error("Hospital ID not found");
    }

    const patientTestRecords: PatientTest[] = testIds.map((testId) => ({
      patientTestId: uuidv4(),
      patientId,
      testId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }));

    await patientTestRepository.createMany(patientTestRecords);

    for (const testId of testIds) {
      await testStatusService.incrementWaitingCount(testId, admin.hospitalId);
    }
  },

  getPatientTests: async (patientId: string): Promise<PatientTest[]> => {
    return patientTestRepository.findByPatientId(patientId);
  },

  removeTest: async (patientId: string, testId: string): Promise<void> => {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      throw new Error("Hospital ID not found");
    }
    await patientTestRepository.delete(patientId, testId);
    await testStatusService.decrementWaitingCount(testId, admin.hospitalId);
  },
};
