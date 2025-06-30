import { v4 as uuidv4 } from "uuid";
import { packageRepository } from "@/repositories/packageRepository";
import { Package } from "@/models/package";
import { PackageFormType } from "@/lib/validations";

export const packageService = {
  createNew: async (
    data: PackageFormType,
    hospitalId: string
  ): Promise<void> => {
    const now = new Date().toISOString();
    const newPackage: Package = {
      packageId: uuidv4(),
      hospitalId,
      name: data.name,
      description: data.description,
      testIds: data.testIds,
      price: parseFloat(data.price),
      createdAt: now,
      updatedAt: now,
    };
    await packageRepository.create(newPackage);
  },

  getById: async (packageId: string): Promise<Package | null> => {
    return packageRepository.findById(packageId);
  },

  getByHospitalId: async (hospitalId: string): Promise<Package[]> => {
    return packageRepository.findByHospitalId(hospitalId);
  },

  update: async (packageId: string, data: PackageFormType): Promise<void> => {
    const now = new Date().toISOString();
    await packageRepository.update(packageId, {
      name: data.name,
      description: data.description,
      testIds: data.testIds,
      price: parseFloat(data.price),
      updatedAt: now,
    });
  },
};
