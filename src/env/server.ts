import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    DYNAMODB_TABLE_ADMINS: z.string().min(1),
    DYNAMODB_TABLE_PATIENTS: z.string().min(1),
    DYNAMODB_TABLE_TESTS: z.string().min(1),
    DYNAMODB_TABLE_HOSPITALS: z.string().min(1),
    DYNAMODB_TABLE_DOCTORS: z.string().min(1),
    DYNAMODB_TABLE_PATIENT_TESTS: z.string().min(1),
    DYNAMODB_TABLE_BOOKING_SLOTS: z.string().min(1),
    DYNAMODB_TABLE_PACKAGES: z.string().min(1),
    JWT_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
