import { testStatusRepository } from "@/repositories/testStatusRepository";
import TestStatus, { TestStatusType } from "@/models/testStatus";

export const testStatusService = {
  initializeTestStatus: async (
    testId: string,
    hospitalId: string
  ): Promise<void> => {
    const now = new Date().toISOString();
    const testStatus: TestStatus = {
      testId,
      hospitalId,
      status: "active",
      patientsWaiting: 0,
      updatedAt: now,
    };
    await testStatusRepository.create(testStatus);
  },

  getHospitalTestStatuses: async (
    hospitalId: string
  ): Promise<TestStatus[]> => {
    return testStatusRepository.findByHospitalId(hospitalId);
  },

  getTestStatus: async (
    testId: string,
    hospitalId: string
  ): Promise<TestStatus | null> => {
    return testStatusRepository.findByTestId(testId, hospitalId);
  },

  updateTestStatus: async (
    testId: string,
    hospitalId: string,
    status: TestStatusType
  ): Promise<void> => {
    const now = new Date().toISOString();
    await testStatusRepository.update(testId, hospitalId, {
      status,
      updatedAt: now,
    });
  },

  incrementWaitingCount: async (
    testId: string,
    hospitalId: string
  ): Promise<void> => {
    const testStatus = await testStatusRepository.findByTestId(
      testId,
      hospitalId
    );
    if (!testStatus) {
      throw new Error("Test status not found");
    }

    const now = new Date().toISOString();
    await testStatusRepository.update(testId, hospitalId, {
      patientsWaiting: testStatus.patientsWaiting + 1,
      updatedAt: now,
    });
  },

  decrementWaitingCount: async (
    testId: string,
    hospitalId: string
  ): Promise<void> => {
    const testStatus = await testStatusRepository.findByTestId(
      testId,
      hospitalId
    );
    if (!testStatus) {
      throw new Error("Test status not found");
    }

    const now = new Date().toISOString();
    await testStatusRepository.update(testId, hospitalId, {
      patientsWaiting: Math.max(0, testStatus.patientsWaiting - 1),
      updatedAt: now,
    });
  },
};
