import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dbClient, { adminsTable } from "@/lib/db/dynamodb";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/admin";
import { AdminSignupType } from "../lib/validations";

export const createUser = async (user: AdminSignupType) => {
  const existingUserParams = {
    TableName: adminsTable,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": user.email,
    },
  };

  const existingUsers = await dbClient.send(
    new QueryCommand(existingUserParams)
  );

  if (existingUsers.Count && existingUsers.Count > 0) {
    throw new Error("Email already registered");
  }

  const now = new Date().toISOString();

  const newUser: User = {
    adminId: uuidv4(),
    email: user.email,
    passwordHash: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    hospitalId: user.hospitalId,
    createdAt: now,
    updatedAt: now,
  };

  const params = {
    TableName: adminsTable,
    Item: newUser,
  };

  try {
    await dbClient.send(new PutCommand(params));
    return newUser;
  } catch (error: any) {
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  const params = {
    TableName: adminsTable,
    IndexName: "email-index", // Replace with your actual GSI name
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    Limit: 1,
  };
  const { Items } = await dbClient.send(new QueryCommand(params));

  if (!Items || Items.length === 0) {
    throw new Error("User not found");
  }
  return Items[0] as User;
};
