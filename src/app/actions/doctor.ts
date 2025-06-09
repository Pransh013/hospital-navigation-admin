"use server";

import dbClient, { doctorsTable } from "@/lib/db/dynamodb";
import Doctor from "@/models/doctor";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getCurrentUserAction } from "@/app/actions/auth";
import { DoctorResponse, DoctorType, GetDoctorsResponse } from "@/lib/validations";
import { v4 as uuidv4 } from "uuid";

export async function addDoctorAction(
  data: DoctorType
): Promise<DoctorResponse> {
  try {
    const { success, user } = await getCurrentUserAction();
    if (!success || !user?.hospitalId) {
      return {
        success: false,
        error: "Hospital ID not found",
      };
    }

    const now = new Date().toISOString();
    const doctorData: Doctor = {
      doctorId: uuidv4(),
      name: data.name,
      designation: data.designation,
      hospitalId: user.hospitalId,
      availability: data.availability,
      createdAt: now,
      updatedAt: now,
    };

    await dbClient.send(
      new PutCommand({
        TableName: doctorsTable,
        Item: doctorData,
      })
    );

    return {
      success: true,
      doctor: doctorData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add doctor",
    };
  }
}

export async function getDoctorsAction(): Promise<GetDoctorsResponse> {
  try {
    const { success, user } = await getCurrentUserAction();
    if (!success || !user?.hospitalId) {
      return {
        success: false,
        error: "Hospital ID not found",
      };
    }

    const { Items } = await dbClient.send(
      new QueryCommand({
        TableName: doctorsTable,
        IndexName: "hospitalId-index",
        KeyConditionExpression: "hospitalId = :hospitalId",
        ExpressionAttributeValues: {
          ":hospitalId": user.hospitalId,
        },
      })
    );

    return {
      success: true,
      doctors: (Items || []) as Doctor[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch doctors",
    };
  }
}

export async function getDoctorAction(
  doctorId: string
): Promise<DoctorResponse> {
  try {
    const { Item } = await dbClient.send(
      new GetCommand({
        TableName: doctorsTable,
        Key: {
          doctorId,
        },
      })
    );

    if (!Item) {
      return {
        success: false,
        error: "Doctor not found",
      };
    }

    return {
      success: true,
      doctor: Item as Doctor,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch doctor",
    };
  }
}

export async function updateDoctorAction(
  doctorId: string,
  data: DoctorType
): Promise<DoctorResponse> {
  try {
    const now = new Date().toISOString();
    const updateData = {
      name: data.name,
      designation: data.designation,
      availability: data.availability,
      updatedAt: now,
    };

    const updateCommand = new UpdateCommand({
      TableName: doctorsTable,
      Key: {
        doctorId,
      },
      UpdateExpression:
        "SET #name = :name, designation = :designation, availability = :availability, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": updateData.name,
        ":designation": updateData.designation,
        ":availability": updateData.availability,
        ":updatedAt": updateData.updatedAt,
      },
    });

    await dbClient.send(updateCommand);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error updating doctor:", error);
    return {
      success: false,
      error: error.message || "Failed to update doctor",
    };
  }
}
