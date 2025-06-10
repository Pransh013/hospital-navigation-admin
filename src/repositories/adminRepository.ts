import dbClient, { adminsTable } from "@/lib/db/dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import Admin from "@/models/admin";

export const adminRepository = {
  create: async (admin: Admin): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: adminsTable,
        Item: admin,
      })
    );
  },

  findByEmail: async (email: string): Promise<Admin | null> => {
    const params = {
      TableName: adminsTable,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
      Limit: 1,
    };
    const { Items } = await dbClient.send(new QueryCommand(params));
    return (Items && Items.length > 0 ? Items[0] : null) as Admin | null;
  },
};
