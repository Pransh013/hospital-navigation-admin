import { env } from "@/env/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const awsConfig = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
};

const dynamoDBClient = new DynamoDBClient(awsConfig);
const dbClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const adminsTable = env.DYNAMODB_TABLE_ADMINS || "admins table";
export const patientsTable = env.DYNAMODB_TABLE_PATIENTS || "patients table";
export const testsTable = env.DYNAMODB_TABLE_TESTS || "tests table";
export const packagesTable = env.DYNAMODB_TABLE_PACKAGES || "packages table";
export const hospitalsTable = env.DYNAMODB_TABLE_HOSPITALS || "hospitals table";
export const doctorsTable = env.DYNAMODB_TABLE_DOCTORS || "doctors table";
export const patientTestsTable =
  env.DYNAMODB_TABLE_PATIENT_TESTS || "patient tests table";
export const bookingSlotsTable =
  env.DYNAMODB_TABLE_BOOKING_SLOTS || "booking slots table";

export default dbClient;
