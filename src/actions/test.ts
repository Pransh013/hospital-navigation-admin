"use server";

import { testService } from "@/services/testService";
import { getCurrentAdminAction } from "@/actions/admin";
import { ActionResponse, TestFormType } from "@/lib/validations";
import { Test } from "@/models/test";

export async function createTestAction(
  formData: TestFormType
): Promise<ActionResponse<void>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    await testService.createNew(formData, admin.hospitalId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create test." };
  }
}

export async function getTestsByHospitalAction(): Promise<
  ActionResponse<Test[]>
> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    const tests = await testService.getAllByHospitalId(admin.hospitalId);
    return { success: true, data: tests };
  } catch (err: any) {
    return { success: false, error: err.message || "Unable to fetch tests." };
  }
}
