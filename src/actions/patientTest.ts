"use server";

import { patientTestService } from "@/services/patientTestService";
import { ActionResponse } from "@/lib/validations";
import { PatientTest } from "@/models/patientTest";
import { getCurrentAdminAction } from "@/actions/admin";

type AssignTestsInput = {
  patientId: string;
  testIds: string[];
  bookingDate?: string;
};

export async function assignPatientTestsAction({
  patientId,
  testIds,
  bookingDate,
}: AssignTestsInput): Promise<ActionResponse<null>> {
  try {
    await patientTestService.assignTests(testIds, patientId, bookingDate);
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

export async function getPatientTestsByHospitalAction(): Promise<
  ActionResponse<PatientTest[]>
> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }
    const tests = await patientTestService.getPatientTestsByHospitalId(
      admin.hospitalId
    );
    return { success: true, data: tests };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to fetch patient tests by hospital.",
    };
  }
}

export async function markPatientTestCompleteAction(patientTestId: string) {
  try {
    await patientTestService.updateStatus(patientTestId, "test_completed");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to mark test as complete.",
    };
  }
}
