import dbClient, { doctorsTable } from "@/lib/db/dynamodb";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Doctor } from "@/models/doctor";

export const doctorRepository = {
  create: async (doctor: Doctor): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: doctorsTable,
        Item: doctor,
      })
    );
  },

  findById: async (doctorId: string): Promise<Doctor | null> => {
    const { Item } = await dbClient.send(
      new GetCommand({
        TableName: doctorsTable,
        Key: { doctorId },
      })
    );
    return Item ? (Item as Doctor) : null;
  },

  findByHospitalId: async (hospitalId: string): Promise<Doctor[]> => {
    const { Items } = await dbClient.send(
      new QueryCommand({
        TableName: doctorsTable,
        IndexName: "hospitalId-index",
        KeyConditionExpression: "hospitalId = :hospitalId",
        ExpressionAttributeValues: {
          ":hospitalId": hospitalId,
        },
      })
    );
    return (Items || []) as Doctor[];
  },

  update: async (
    doctorId: string,
    updateData: Partial<Doctor>
  ): Promise<void> => {
    await dbClient.send(
      new UpdateCommand({
        TableName: doctorsTable,
        Key: { doctorId },
        UpdateExpression:
          "SET #name = :n, designation = :d, availability = :a, updatedAt = :u",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: {
          ":n": updateData.name,
          ":d": updateData.designation,
          ":a": updateData.availability,
          ":u": updateData.updatedAt,
        },
      })
    );
  },
};
