"use server";

import dbClient, { patientsTable } from "@/lib/db/dynamodb";
import Patient from "@/models/patient";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { hashPassword } from "@/lib/authUtils";
import { getCurrentAdminAction } from "./admin";
import { v4 as uuidv4 } from "uuid";

type AddPatientInput = {
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female" | "other";
  contactNumber: string;
  address: string;
};

export async function createPatientAction(
  formData: AddPatientInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const existingPatientParams = {
      TableName: patientsTable,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": formData.email,
      },
    };

    const existingPatients = await dbClient.send(
      new QueryCommand(existingPatientParams)
    );

    if (existingPatients.Count && existingPatients.Count > 0) {
      throw new Error("Email already registered");
    }

    const { success, admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return {
        success: false,
        error: "Hospital ID not found",
      };
    }

    const rawPassword = (formData.firstName + formData.lastName).toLowerCase();
    const passwordHash = await hashPassword(rawPassword);
    const now = new Date().toISOString();

    const newPatient: Patient = {
      patientId: uuidv4(),
      email: formData.email,
      passwordHash: passwordHash,
      firstName: formData.firstName,
      lastName: formData.lastName,
      hospitalId: admin.hospitalId,
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      address: formData.address,
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: patientsTable,
      Item: newPatient,
    };

    await dbClient.send(new PutCommand(params));
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add patient",
    };
  }
}

export async function getPatientsAction() {
  try {
    const { success, admin } = await getCurrentAdminAction();
    if (!success || !admin?.hospitalId) {
      return {
        success: false,
        error: "Hospital ID not found",
      };
    }

    const params = {
      TableName: patientsTable,
      IndexName: "hospitalId-index",
      KeyConditionExpression: "hospitalId = :h",
      ExpressionAttributeValues: {
        ":h": admin.hospitalId,
      },
    };

    const { Items } = await dbClient.send(new QueryCommand(params));
    return (Items || []) as Patient[];
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch patients",
    };
  }
}

export async function getPatientAction(patientId: string) {
  try {
    const params = {
      TableName: patientsTable,
      Key: { patientId },
    };

    const { Item } = await dbClient.send(new GetCommand(params));
    if (!Item) {
      throw new Error("Patient not found");
    }

    return { success: true, patient: Item as Patient };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch patient",
    };
  }
}

export type PatientResponse = {
  success: boolean;
  error?: string;
};

export async function updatePatientAction(
  patientId: string,
  data: AddPatientInput
): Promise<PatientResponse> {
  try {
    const now = new Date().toISOString();

    const updateCommand = new UpdateCommand({
      TableName: patientsTable,
      Key: {
        patientId,
      },
      UpdateExpression: `
        SET firstName = :firstName,
            lastName = :lastName,
            email = :email,
            gender = :gender,
            contactNumber = :contactNumber,
            address = :address,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ":firstName": data.firstName,
        ":lastName": data.lastName,
        ":email": data.email,
        ":gender": data.gender,
        ":contactNumber": data.contactNumber,
        ":address": data.address,
        ":updatedAt": now,
      },
    });

    await dbClient.send(updateCommand);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating patient:", error);
    return {
      success: false,
      error: error.message || "Failed to update patient",
    };
  }
}
