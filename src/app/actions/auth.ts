"use server";

import { SigninType, SignupType } from "@/lib/validations";
import {
  generateToken,
  hashPassword,
  isValidPassword,
  verifyToken,
} from "@/lib/authUtils";
import { createUser, getUserByEmail } from "@/lib/db/userService";
import { cookies } from "next/headers";
import { env } from "@/env/client";

const AUTH_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY = 60 * 60;

type AuthResponse = {
  success: boolean;
  error?: string;
};

export async function signupAction(
  formData: SignupType
): Promise<AuthResponse> {
  try {
    const passwordHash = await hashPassword(formData.password);
    const user = await createUser({ ...formData, password: passwordHash });
    const token = await generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    (await cookies()).set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NEXT_PUBLIC_ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: TOKEN_EXPIRY,
      path: "/",
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Signup failed",
    };
  }
}

export async function signinAction(
  formData: SigninType
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

    const token = await generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    (await cookies()).set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NEXT_PUBLIC_ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: TOKEN_EXPIRY,
      path: "/",
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Signin failed",
    };
  }
}

export async function signoutAction(): Promise<AuthResponse> {
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

export async function getCurrentUserAction(): Promise<{
  success: boolean;
  user?: { name: string; email: string };
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)!;
    const decoded = await verifyToken(token.value);
    const user = await getUserByEmail(decoded.email);

    return {
      success: true,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: "Failed to get user data. Please try again.",
    };
  }
}
