import dbClient, { packagesTable } from "@/lib/db/dynamodb";
import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Package } from "@/models/package";

export const packageRepository = {
  create: async (pkg: Package): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: packagesTable,
        Item: pkg,
      })
    );
  },

  findById: async (packageId: string): Promise<Package | null> => {
    const { Item } = await dbClient.send(
      new GetCommand({
        TableName: packagesTable,
        Key: { packageId },
      })
    );
    return Item ? (Item as Package) : null;
  },

  findByHospitalId: async (hospitalId: string): Promise<Package[]> => {
    const { Items } = await dbClient.send(
      new QueryCommand({
        TableName: packagesTable,
        IndexName: "hospitalId-index",
        KeyConditionExpression: "hospitalId = :hospitalId",
        ExpressionAttributeValues: {
          ":hospitalId": hospitalId,
        },
      })
    );
    return (Items || []) as Package[];
  },

  update: async (
    packageId: string,
    updateData: Partial<Package>
  ): Promise<void> => {
    const { name, description, testIds, price, updatedAt } = updateData;
    await dbClient.send(
      new UpdateCommand({
        TableName: packagesTable,
        Key: { packageId },
        UpdateExpression:
          "SET #name = :n, description = :d, testIds = :t, price = :p, updatedAt = :u",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: {
          ":n": name,
          ":d": description,
          ":t": testIds,
          ":p": price,
          ":u": updatedAt,
        },
      })
    );
  },
};
