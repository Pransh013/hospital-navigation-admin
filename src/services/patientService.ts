import { v4 as uuidv4 } from "uuid";
import { patientRepository } from "@/repositories/patientRepository";
import { Patient } from "@/models/patient";
import { hashPassword } from "@/lib/authUtils";
import { PatientFormType } from "@/lib/validations";

export const patientService = {
  createNew: async (
    data: PatientFormType,
    hospitalId: string
  ): Promise<string> => {
    const existingPatient = await patientRepository.findByEmail(data.email);
    if (existingPatient) {
      throw new Error("Email already registered");
    }

    const rawPassword = (data.firstName + data.lastName).toLowerCase();
    const passwordHash = await hashPassword(rawPassword);
    const now = new Date().toISOString();

    const patient: Patient = {
      patientId: uuidv4(),
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      hospitalId,
      gender: data.gender,
      contactNumber: data.contactNumber,
      address: data.address,
      bookingDate: data.bookingDate
        ? data.bookingDate.toISOString().slice(0, 10)
        : "",
      consultationRequired: data.consultationRequired,
      createdAt: now,
      updatedAt: now,
    };

    await patientRepository.create(patient);
    return patient.patientId;
  },

  getById: async (patientId: string): Promise<Patient | null> => {
    return patientRepository.findById(patientId);
  },

  getByHospitalId: async (hospitalId: string): Promise<Patient[]> => {
    return patientRepository.findByHospitalId(hospitalId);
  },

  update: async (patientId: string, data: PatientFormType): Promise<void> => {
    const now = new Date().toISOString();
    await patientRepository.update(patientId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      gender: data.gender,
      contactNumber: data.contactNumber,
      address: data.address,
      bookingDate: data.bookingDate
        ? data.bookingDate.toISOString().slice(0, 10)
        : "",
      consultationRequired: data.consultationRequired,
      updatedAt: now,
    });
  },

  updateReportUrl: async (
    patientId: string,
    reportUrl: string
  ): Promise<void> => {
    const now = new Date().toISOString();
    await patientRepository.update(patientId, {
      reportUrl,
      reportUploadedAt: now,
      updatedAt: now,
    });
  },
};
