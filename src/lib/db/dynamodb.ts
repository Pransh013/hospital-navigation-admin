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

export const usersTable = env.DYNAMODB_TABLE_USERS || "users table";
export const patientsTable = env.DYNAMODB_TABLE_PATIENTS || "patients table";
export const testsTable = env.DYNAMODB_TABLE_TESTS || "tests table";
export const hospitalsTable = env.DYNAMODB_TABLE_HOSPITALS || "hospitals table";

export default dbClient;
