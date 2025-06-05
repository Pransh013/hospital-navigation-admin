import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import dbClient, { usersTable } from "@/lib/db/dynamodb";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/models/user";
import { SignupType } from "../validations";

export const createUser = async (user: SignupType) => {
  const now = new Date().toISOString();

  const newUser: User = {
    userId: uuidv4(),
    email: user.email,
    passwordHash: user.password,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    hospitalId: user.hospitalId,
    createdAt: now,
    updatedAt: now,
  };

  const params = {
    TableName: usersTable,
    Item: newUser,
    ConditionExpression: "attribute_not_exists(email)",
  };

  try {
    await dbClient.send(new PutCommand(params));
    return newUser;
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error("Email already registered");
    }
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  const params = {
    TableName: usersTable,
    Key: { email },
  };
  const { Item } = await dbClient.send(new GetCommand(params));
  if (!Item) {
    throw new Error("User not found");
  }
  return Item as User;
};
