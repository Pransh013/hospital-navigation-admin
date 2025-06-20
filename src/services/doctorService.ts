import { v4 as uuidv4 } from "uuid";
import { doctorRepository } from "@/repositories/doctorRepository";
import { Doctor } from "@/models/doctor";
import { DoctorFormType } from "@/lib/validations";

export const doctorService = {
  createNew: async (
    data: DoctorFormType,
    hospitalId: string
  ): Promise<void> => {
    const now = new Date().toISOString();
    const doctor: Doctor = {
      doctorId: uuidv4(),
      name: data.name,
      designation: data.designation,
      hospitalId,
      availability: data.availability,
      createdAt: now,
      updatedAt: now,
    };
    await doctorRepository.create(doctor);
  },

  getById: async (doctorId: string): Promise<Doctor | null> => {
    return doctorRepository.findById(doctorId);
  },

  getByHospitalId: async (hospitalId: string): Promise<Doctor[]> => {
    return doctorRepository.findByHospitalId(hospitalId);
  },

  update: async (doctorId: string, data: DoctorFormType): Promise<void> => {
    const now = new Date().toISOString();
    await doctorRepository.update(doctorId, {
      name: data.name,
      designation: data.designation,
      availability: data.availability,
      updatedAt: now,
    });
  },
};
