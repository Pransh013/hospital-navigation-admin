"use server";

import {
  generateToken,
  hashPassword,
  isValidPassword,
  verifyToken,
} from "@/lib/authUtils";
import { createUser, getUserByEmail } from "@/services/userService";
import { cookies } from "next/headers";
import { AdminSigninType, AdminSignupType } from "@/lib/validations";
import Admin from "@/models/admin";

const AUTH_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY = 60 * 60;

type AuthResponse = {
  success: boolean;
  admin?: { name: string; email: string; hospitalId: string };
  error?: string;
};

async function createTokenAndSetCookie(
  user: Pick<Admin, "adminId" | "email" | "hospitalId">
) {
  const token = await generateToken(user);
  (await cookies()).set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_EXPIRY,
    path: "/",
  });
}

export async function adminSignupAction(
  formData: AdminSignupType
): Promise<AuthResponse> {
  try {
    const passwordHash = await hashPassword(formData.password);
    const user = await createUser({ ...formData, password: passwordHash });

    await createTokenAndSetCookie({
      adminId: user.adminId,
      email: user.email,
      hospitalId: user.hospitalId,
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Signup failed",
    };
  }
}

export async function adminSigninAction(
  formData: AdminSigninType
): Promise<AuthResponse> {
  try {
    const user = await getUserByEmail(formData.email);
    const valid = await isValidPassword(formData.password, user.passwordHash);

    if (!valid) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    await createTokenAndSetCookie({
      adminId: user.adminId,
      email: user.email,
      hospitalId: user.hospitalId,
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Signin failed",
    };
  }
}

export async function adminSignoutAction(): Promise<AuthResponse> {
  try {
    (await cookies()).delete(AUTH_COOKIE_NAME);
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Signout failed",
    };
  }
}

export async function getCurrentAdminAction(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME);
    if (!token) throw new Error("No auth token found");
    const decoded = await verifyToken(token.value);
    const user = await getUserByEmail(decoded.email);

    return {
      success: true,
      admin: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        hospitalId: user.hospitalId,
      },
    };
  } catch (err: any) {
    throw new Error("Failed to get user data. Please try again.");
  }
}
