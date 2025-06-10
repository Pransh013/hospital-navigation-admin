"use server";

import { hospitalService } from "@/services/hospitalService";

export async function getAllHospitalsAction() {
  return await hospitalService.getAll();
}
