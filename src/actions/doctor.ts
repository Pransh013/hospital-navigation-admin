"use server";

import { doctorService } from "@/services/doctorService";
import { getCurrentAdminAction } from "@/actions/admin";
import { DoctorFormType, ActionResponse } from "@/lib/validations";
import Doctor from "@/models/doctor";

export async function addDoctorAction(
  data: DoctorFormType
): Promise<ActionResponse<void>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    await doctorService.createNew(data, admin.hospitalId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add doctor" };
  }
}

export async function getDoctorsAction(): Promise<ActionResponse<Doctor[]>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    const doctors = await doctorService.getByHospitalId(admin.hospitalId);
    return { success: true, data: doctors };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch doctors" };
  }
}

export async function getDoctorAction(
  doctorId: string
): Promise<ActionResponse<Doctor>> {
  try {
    const doctor = await doctorService.getById(doctorId);
    if (!doctor) {
      return { success: false, error: "Doctor not found" };
    }
    return { success: true, data: doctor };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch doctor" };
  }
}

export async function updateDoctorAction(
  doctorId: string,
  data: DoctorFormType
): Promise<ActionResponse<void>> {
  try {
    await doctorService.update(doctorId, data);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update doctor" };
  }
}
