"use server";

import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";
import {
  ActionResponse,
  AdminSigninType,
  AdminSignupType,
} from "@/lib/validations";
import Admin from "@/models/admin";

export async function adminSignupAction(
  formData: AdminSignupType
): Promise<ActionResponse<void>> {
  try {
    const newUser = await adminService.createNew(formData);
    await authService.createAuthCookie(newUser);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Signup failed" };
  }
}

export async function adminSigninAction(
  formData: AdminSigninType
): Promise<ActionResponse<void>> {
  try {
    const user = await authService.verifyCredentials(formData);
    await authService.createAuthCookie(user);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Signin failed" };
  }
}

export async function adminSignoutAction(): Promise<ActionResponse<void>> {
  try {
    await authService.clearAuthCookie();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Signout failed" };
  }
}

export async function getCurrentAdminAction(): Promise<
  ActionResponse<Pick<Admin, "email" | "hospitalId"> & { name: string }>
> {
  try {
    const user = await authService.getCurrentAdmin();
    return {
      success: true,
      data: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        hospitalId: user.hospitalId,
      },
    };
  } catch (err: any) {
    return { success: false, error: "User not authenticated." };
  }
}
