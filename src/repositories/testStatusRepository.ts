import dbClient, { testStatusTable } from "@/lib/db/dynamodb";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import TestStatus from "@/models/testStatus";

export const testStatusRepository = {
  create: async (testStatus: TestStatus): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: testStatusTable,
        Item: testStatus,
      })
    );
  },

  findByTestId: async (
    testId: string,
    hospitalId: string
  ): Promise<TestStatus | null> => {
    const { Item } = await dbClient.send(
      new GetCommand({
        TableName: testStatusTable,
        Key: {
          testId,
          hospitalId,
        },
      })
    );
    return Item ? (Item as TestStatus) : null;
  },

  findByHospitalId: async (hospitalId: string): Promise<TestStatus[]> => {
    const { Items } = await dbClient.send(
      new ScanCommand({
        TableName: testStatusTable,
        FilterExpression: "hospitalId = :hospitalId",
        ExpressionAttributeValues: {
          ":hospitalId": hospitalId,
        },
      })
    );
    return (Items || []) as TestStatus[];
  },

  update: async (
    testId: string,
    hospitalId: string,
    data: Partial<TestStatus>
  ): Promise<void> => {
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "testId" && key !== "hospitalId") {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
        expressionAttributeNames[`#${key}`] = key;
      }
    });

    await dbClient.send(
      new UpdateCommand({
        TableName: testStatusTable,
        Key: {
          testId,
          hospitalId,
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
      })
    );
  },
};
