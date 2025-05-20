import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "production"]),
});

export const signupSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 8 characters" }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  hospitalId: z.string().min(1, "Please select a hospital"),
});

export type SignupType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
  .string()
  .min(6, { message: "Password must be atleast 6 characters long" }),
});

export type SigninType = z.infer<typeof signinSchema>;