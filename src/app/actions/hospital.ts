"use server";

import dbClient, { hospitalsTable } from "@/lib/db/dynamodb";
import Hospital from "@/models/hospital";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

type HospitalResponse = {
  success: boolean;
  error?: string;
  hospitals?: Hospital[];
};

const HOSPITAL_PROJECTION = "hospitalId, hospitalName";

export async function getAllHospitalsAction(): Promise<HospitalResponse> {
  try {
    const { Items } = await dbClient.send(
      new ScanCommand({
        TableName: hospitalsTable,
        ProjectionExpression: HOSPITAL_PROJECTION,
      })
    );

    if (!Items?.length) {
      return {
        success: false,
        error: "No hospitals found",
      };
    }

    return {
      success: true,
      hospitals: Items as Hospital[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch hospitals",
    };
  }
}
