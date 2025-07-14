import { v4 as uuidv4 } from "uuid";
import { patientTestRepository } from "@/repositories/patientTestRepository";
import { testRepository } from "@/repositories/testRepository";
import { getCurrentAdminAction } from "@/actions/admin";
import { PatientTest } from "@/models/patientTest";
import { patientRepository } from "@/repositories/patientRepository";

export const patientTestService = {
  assignTests: async (
    testIds: string[],
    patientId: string,
    bookingDate?: string
  ): Promise<void> => {
    const now = new Date().toISOString();

    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      throw new Error("Hospital ID not found");
    }

    // Overwrite the patient's bookingDate with the new bookingDate
    if (bookingDate) {
      await patientRepository.update(patientId, { bookingDate });
    }

    const patientTestRecords: PatientTest[] = testIds.map((testId) => ({
      patientTestId: uuidv4(),
      patientId,
      testId,
      hospitalId: admin.hospitalId,
      status: "assigned",
      createdAt: now,
      updatedAt: now,
      bookingDate,
    }));

    await patientTestRepository.createMany(patientTestRecords);

    for (const testId of testIds) {
      await testRepository.incrementPatientsWaiting(testId);
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
    await testRepository.decrementPatientsWaiting(testId);
  },

  getPatientTestsByHospitalId: async (
    hospitalId: string
  ): Promise<PatientTest[]> => {
    return patientTestRepository.findByHospitalId(hospitalId);
  },

  updateStatus: async (
    patientTestId: string,
    status: "assigned" | "test_completed" | "cancelled"
  ): Promise<void> => {
    await patientTestRepository.update(patientTestId, {
      status,
      updatedAt: new Date().toISOString(),
    });
  },
};
