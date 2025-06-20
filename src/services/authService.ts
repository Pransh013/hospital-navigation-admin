import { cookies } from "next/headers";
import { generateToken, isValidPassword, verifyToken } from "@/lib/authUtils";
import { adminService } from "./adminService";
import { AdminSigninType } from "@/lib/validations";
import { Admin } from "@/models/admin";
import { AUTH_COOKIE_NAME, TOKEN_EXPIRY_SECONDS } from "@/constants";

export const authService = {
  verifyCredentials: async (credentials: AdminSigninType): Promise<Admin> => {
    const user = await adminService.getByEmail(credentials.email);
    const isPasswordValid = await isValidPassword(
      credentials.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    return user;
  },

  createAuthCookie: async (
    user: Pick<Admin, "adminId" | "email" | "hospitalId">
  ): Promise<void> => {
    const token = await generateToken(user);
    (await cookies()).set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_EXPIRY_SECONDS,
      path: "/",
    });
  },

  clearAuthCookie: async (): Promise<void> => {
    (await cookies()).delete(AUTH_COOKIE_NAME);
  },

  getCurrentAdmin: async (): Promise<Admin> => {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    if (!token) throw new Error("Authentication token not found.");

    const decoded = await verifyToken(token);
    if (!decoded?.email) throw new Error("Invalid token payload.");

    return adminService.getByEmail(decoded.email);
  },
};
