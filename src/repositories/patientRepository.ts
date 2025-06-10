import dbClient, { patientsTable } from "@/lib/db/dynamodb";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import Patient from "@/models/patient";

export const patientRepository = {
  create: async (patient: Patient): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: patientsTable,
        Item: patient,
      })
    );
  },

  findById: async (patientId: string): Promise<Patient | null> => {
    const { Item } = await dbClient.send(
      new GetCommand({
        TableName: patientsTable,
        Key: { patientId },
      })
    );
    return Item ? (Item as Patient) : null;
  },

  findByEmail: async (email: string): Promise<Patient | null> => {
    const { Items } = await dbClient.send(
      new QueryCommand({
        TableName: patientsTable,
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );
    return Items && Items.length > 0 ? (Items[0] as Patient) : null;
  },

  findByHospitalId: async (hospitalId: string): Promise<Patient[]> => {
    const { Items } = await dbClient.send(
      new QueryCommand({
        TableName: patientsTable,
        IndexName: "hospitalId-index",
        KeyConditionExpression: "hospitalId = :hospitalId",
        ExpressionAttributeValues: {
          ":hospitalId": hospitalId,
        },
      })
    );
    return (Items || []) as Patient[];
  },

  update: async (
    patientId: string,
    updateData: Partial<Patient>
  ): Promise<void> => {
    await dbClient.send(
      new UpdateCommand({
        TableName: patientsTable,
        Key: { patientId },
        UpdateExpression:
          "SET firstName = :f, lastName = :l, email = :e, gender = :g, contactNumber = :c, address = :a, updatedAt = :u",
        ExpressionAttributeValues: {
          ":f": updateData.firstName,
          ":l": updateData.lastName,
          ":e": updateData.email,
          ":g": updateData.gender,
          ":c": updateData.contactNumber,
          ":a": updateData.address,
          ":u": updateData.updatedAt,
        },
      })
    );
  },
};
