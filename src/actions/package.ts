"use server";

import { packageService } from "@/services/packageService";
import { getCurrentAdminAction } from "@/actions/admin";
import { PackageFormType, ActionResponse } from "@/lib/validations";
import { Package } from "@/models/package";

export async function addPackageAction(
  data: PackageFormType
): Promise<ActionResponse<void>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    await packageService.createNew(data, admin.hospitalId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add package" };
  }
}

export async function getPackagesAction(): Promise<ActionResponse<Package[]>> {
  try {
    const { success, data: admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return { success: false, error: "Hospital ID not found" };
    }

    const packages = await packageService.getByHospitalId(admin.hospitalId);
    return { success: true, data: packages };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch packages" };
  }
}

export async function getPackageAction(
  packageId: string
): Promise<ActionResponse<Package>> {
  try {
    const pkg = await packageService.getById(packageId);
    if (!pkg) {
      return { success: false, error: "Package not found" };
    }
    return { success: true, data: pkg };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch package" };
  }
}

export async function updatePackageAction(
  packageId: string,
  data: PackageFormType
): Promise<ActionResponse<void>> {
  try {
    await packageService.update(packageId, data);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update package" };
  }
}
