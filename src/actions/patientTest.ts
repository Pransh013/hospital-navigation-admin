"use server";

import { patientTestService } from "@/services/patientTestService";
import { ActionResponse } from "@/lib/validations";
import { PatientTest, PatientTestStatus } from "@/models/patientTest";
import { getCurrentAdminAction } from "@/actions/admin";

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

export async function scheduleConsultationAction(
  patientTestId: string,
  consultationSlotId: string
): Promise<ActionResponse<null>> {
  try {
    await patientTestService.scheduleConsultation(
      patientTestId,
      consultationSlotId
    );
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to schedule consultation.",
    };
  }
}

export async function updatePatientTestStatusAction(
  patientTestId: string,
  status: PatientTestStatus
): Promise<ActionResponse<null>> {
  try {
    await patientTestService.updateStatus(patientTestId, status);
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update test status.",
    };
  }
}
