"use server";

import { patientTestService } from "@/services/patientTestService";
import { ActionResponse } from "@/lib/validations";
import PatientTest from "@/models/patientTest";

type AssignTestsInput = {
  patientId: string;
  testIds: string[];
};

export async function assignPatientTestsAction({
  patientId,
  testIds,
}: AssignTestsInput): Promise<ActionResponse<null>> {
  try {
    await patientTestService.assignTests(testIds, patientId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to assign tests." };
  }
}

export async function getPatientTestsAction(
  patientId: string
): Promise<ActionResponse<PatientTest[]>> {
  try {
    const tests = await patientTestService.getPatientTests(patientId);
    return { success: true, data: tests };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to fetch patient tests.",
    };
  }
}

export async function removePatientTestAction(
  patientId: string,
  testId: string
): Promise<ActionResponse<null>> {
  try {
    await patientTestService.removeTest(patientId, testId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to remove test." };
  }
}
