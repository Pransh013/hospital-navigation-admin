"use server";

import { hospitalService } from "@/services/hospitalService";

export async function getAllHospitalsAction() {
  return await hospitalService.getAll();
}

export async function getHospitalByIdAction(hospitalId: string) {
  return await hospitalService.getById(hospitalId);
}
