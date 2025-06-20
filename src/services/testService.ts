import { v4 as uuidv4 } from "uuid";
import { testRepository } from "@/repositories/testRepository";
import { Test } from "@/models/test";
import { TestFormType } from "@/lib/validations";

export const testService = {
  createNew: async (data: TestFormType, hospitalId: string): Promise<Test> => {
    const now = new Date().toISOString();
    const existingTests = await testRepository.findByHospitalId(hospitalId);
    if (
      existingTests.some(
        (t) => t.name.trim().toLowerCase() === data.name.trim().toLowerCase()
      )
    ) {
      throw new Error(
        "A test with this name already exists for this hospital."
      );
    }
    const newTest: Test = {
      testId: uuidv4(),
      hospitalId,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      roomNumber: data.roomNumber,
      floorNumber: data.floorNumber,
      status: "active",
      patientsWaiting: 0,
      createdAt: now,
      updatedAt: now,
    };

    await testRepository.create(newTest);
    return newTest;
  },

  getAllByHospitalId: async (hospitalId: string): Promise<Test[]> => {
    return await testRepository.findByHospitalId(hospitalId);
  },
};
