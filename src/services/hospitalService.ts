import { hospitalRepository } from "@/repositories/hospitalRepository";
import { ActionResponse } from "@/lib/validations";
import { Hospital } from "@/models/hospital";

export const hospitalService = {
  getAll: async (): Promise<ActionResponse<Hospital[]>> => {
    try {
      const hospitals = await hospitalRepository.getAll();

      if (!hospitals.length) {
        return {
          success: false,
          error: "No hospitals found",
        };
      }

      return {
        success: true,
        data: hospitals,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch hospitals",
      };
    }
  },
  getById: async (hospitalId: string): Promise<ActionResponse<Hospital>> => {
    try {
      const hospital = await hospitalRepository.findById(hospitalId);
      if (!hospital) {
        return { success: false, error: "Hospital not found" };
      }
      return { success: true, data: hospital };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch hospital",
      };
    }
  },
};
