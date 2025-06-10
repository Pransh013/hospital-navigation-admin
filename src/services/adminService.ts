import { v4 as uuidv4 } from "uuid";
import { adminRepository } from "@/repositories/adminRepository";
import Admin from "@/models/admin";
import { AdminSignupType } from "@/lib/validations";
import { hashPassword } from "@/lib/authUtils";

const createAdminData = (
  adminData: AdminSignupType,
  passwordHash: string
): Admin => {
  const now = new Date().toISOString();
  return {
    adminId: uuidv4(),
    email: adminData.email,
    passwordHash: passwordHash,
    firstName: adminData.firstName,
    lastName: adminData.lastName,
    hospitalId: adminData.hospitalId,
    createdAt: now,
    updatedAt: now,
  };
};

export const adminService = {
  createNew: async (adminData: AdminSignupType): Promise<Admin> => {
    const existingAdmin = await adminRepository.findByEmail(adminData.email);
    if (existingAdmin) {
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(adminData.password);
    const newAdmin = createAdminData(adminData, passwordHash);

    await adminRepository.create(newAdmin);
    return newAdmin;
  },

  getByEmail: async (email: string): Promise<Admin> => {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("User not found");
    }
    return admin;
  },
};
