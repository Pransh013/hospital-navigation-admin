import { v4 as uuidv4 } from "uuid";
import { testRepository } from "@/repositories/testRepository";
import Test from "@/models/test";
import { TestFormType } from "@/lib/validations";

export const testService = {
  createNew: async (data: TestFormType, hospitalId: string): Promise<Test> => {
    const now = new Date().toISOString();
    const newTest: Test = {
      testId: uuidv4(),
      hospitalId,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      roomNumber: data.roomNumber,
      floorNumber: data.floorNumber,
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
