import { v4 as uuidv4 } from "uuid";
import { patientTestRepository } from "@/repositories/patientTestRepository";
import { testRepository } from "@/repositories/testRepository";
import { getCurrentAdminAction } from "@/actions/admin";
import { PatientTest, PatientTestStatus } from "@/models/patientTest";

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
      hospitalId: admin.hospitalId,
      status: "assigned",
      createdAt: now,
      updatedAt: now,
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

  scheduleConsultation: async (
    patientTestId: string,
    consultationSlotId: string
  ): Promise<void> => {
    const patientTest = await patientTestRepository.findById(patientTestId);
    if (!patientTest) throw new Error("Patient test not found");
    if (patientTest.consultationSlotId)
      throw new Error("Consultation already scheduled for this test");
    await patientTestRepository.update(patientTestId, {
      consultationSlotId,
      status: "consultation_scheduled",
      updatedAt: new Date().toISOString(),
    });
  },

  updateStatus: async (
    patientTestId: string,
    status: PatientTestStatus
  ): Promise<void> => {
    await patientTestRepository.update(patientTestId, {
      status,
      updatedAt: new Date().toISOString(),
    });
  },
};
