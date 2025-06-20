"use server";

import { patientService } from "@/services/patientService";
import { getCurrentAdminAction } from "@/actions/admin";
import { ActionResponse, PatientFormType } from "@/lib/validations";
import { Patient } from "@/models/patient";

export async function createPatientAction(
  formData: PatientFormType
): Promise<ActionResponse<string>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    const patientId = await patientService.createNew(
      formData,
      admin.hospitalId
    );
    return { success: true, data: patientId };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add patient" };
  }
}

export async function getPatientsAction(): Promise<ActionResponse<Patient[]>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    const patients = await patientService.getByHospitalId(admin.hospitalId);
    return { success: true, data: patients };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch patients" };
  }
}

export async function getPatientAction(
  patientId: string
): Promise<ActionResponse<Patient>> {
  try {
    const patient = await patientService.getById(patientId);
    if (!patient) {
      return { success: false, error: "Patient not found" };
    }
    return { success: true, data: patient };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch patient" };
  }
}

export async function updatePatientAction(
  patientId: string,
  data: PatientFormType
): Promise<ActionResponse<void>> {
  try {
    await patientService.update(patientId, data);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update patient" };
  }
}
