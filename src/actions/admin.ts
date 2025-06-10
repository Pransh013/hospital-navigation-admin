"use server";

import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";
import { AdminSigninType, AdminSignupType } from "@/lib/validations";

type AuthResponse = {
  success: boolean;
  admin?: { name: string; email: string; hospitalId: string };
  error?: string;
};

export async function adminSignupAction(
  formData: AdminSignupType
): Promise<Pick<AuthResponse, "success" | "error">> {
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
): Promise<Pick<AuthResponse, "success" | "error">> {
  try {
    const user = await authService.verifyCredentials(formData);
    await authService.createAuthCookie(user);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Signin failed" };
  }
}

export async function adminSignoutAction(): Promise<
  Pick<AuthResponse, "success" | "error">
> {
  try {
    authService.clearAuthCookie();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Signout failed" };
  }
}

export async function getCurrentAdminAction(): Promise<AuthResponse> {
  try {
    const user = await authService.getCurrentAdmin();
    return {
      success: true,
      admin: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        hospitalId: user.hospitalId,
      },
    };
  } catch (err: any) {
    return { success: false, error: "User not authenticated." };
  }
}
