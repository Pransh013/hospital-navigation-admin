import dbClient, { hospitalsTable } from "@/lib/db/dynamodb";
import { Hospital } from "@/models/hospital";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const HOSPITAL_PROJECTION = "hospitalId, hospitalName";

export const hospitalRepository = {
  getAll: async (): Promise<Hospital[]> => {
    const { Items } = await dbClient.send(
      new ScanCommand({
        TableName: hospitalsTable,
        ProjectionExpression: HOSPITAL_PROJECTION,
      })
    );

    return (Items as Hospital[]) ?? [];
  },
};
