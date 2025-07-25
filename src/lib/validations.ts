import { Admin } from "@/models/admin";
import { z } from "zod";

export const adminSignupSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 8 characters" }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  hospitalId: z.string().min(1, "Please select a hospital"),
});

export type AdminSignupType = z.infer<typeof adminSignupSchema>;

export const adminSigninSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});

export type AdminSigninType = z.infer<typeof adminSigninSchema>;

export const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.string().min(1, "Please enter designation"),
  availability: z.enum(["available", "on-leave"], {
    required_error: "Please select availability",
  }),
});

export type DoctorFormType = z.infer<typeof doctorFormSchema>;

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  tests: z.array(z.string()).optional(),
  packageId: z.string().optional(),
  assignmentType: z.enum(["tests", "packages"]),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  bookingDate: z.date({ required_error: "Booking date is required" }),
  consultationRequired: z.boolean().optional(),
});

export type PatientFormType = z.infer<typeof patientFormSchema>;

export const testFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d*\.?\d*$/, "Must be a valid price format"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d+$/, "Must be a number"),
  roomNumber: z.string().optional(),
  floorNumber: z.string().optional(),
});

export type TestFormType = z.infer<typeof testFormSchema>;

export const packageFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  testIds: z.array(z.string()).min(1, "Please select at least one test"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d*\.?\d*$/, "Must be a valid price format"),
});

export type PackageFormType = z.infer<typeof packageFormSchema>;

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type TokenPayload = Pick<Admin, "adminId" | "email" | "hospitalId">;
