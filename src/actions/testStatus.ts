"use server"

import { testStatusService } from "@/services/testStatusService";
import { TestStatusType } from "@/models/testStatus";

export async function getHospitalTestStatusesAction(hospitalId: string) {
  try {
    const testStatuses = await testStatusService.getHospitalTestStatuses(
      hospitalId
    );
    return {
      success: true,
      data: testStatuses,
    };
  } catch (error) {
    console.error("Error getting hospital test statuses:", error);
    return {
      success: false,
      error: "Failed to get hospital test statuses",
    };
  }
}

export async function getTestStatusAction(testId: string, hospitalId: string) {
  try {
    const testStatus = await testStatusService.getTestStatus(
      testId,
      hospitalId
    );
    return {
      success: true,
      data: testStatus,
    };
  } catch (error) {
    console.error("Error getting test status:", error);
    return {
      success: false,
      error: "Failed to get test status",
    };
  }
}

export async function updateTestStatusAction(
  testId: string,
  hospitalId: string,
  status: TestStatusType
) {
  try {
    await testStatusService.updateTestStatus(testId, hospitalId, status);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating test status:", error);
    return {
      success: false,
      error: "Failed to update test status",
    };
  }
}

export async function incrementWaitingCountAction(
  testId: string,
  hospitalId: string
) {
  try {
    await testStatusService.incrementWaitingCount(testId, hospitalId);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error incrementing waiting count:", error);
    return {
      success: false,
      error: "Failed to increment waiting count",
    };
  }
}

export async function decrementWaitingCountAction(
  testId: string,
  hospitalId: string
) {
  try {
    await testStatusService.decrementWaitingCount(testId, hospitalId);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error decrementing waiting count:", error);
    return {
      success: false,
      error: "Failed to decrement waiting count",
    };
  }
}
