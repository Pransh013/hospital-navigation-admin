import dbClient, { testsTable } from "@/lib/db/dynamodb";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Test } from "@/models/test";

export const testRepository = {
  create: async (test: Test): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: testsTable,
        Item: test,
      })
    );
  },

  findByHospitalId: async (hospitalId: string): Promise<Test[]> => {
    const params = {
      TableName: testsTable,
      IndexName: "hospitalId-index",
      KeyConditionExpression: "hospitalId = :hospitalId",
      ExpressionAttributeValues: {
        ":hospitalId": hospitalId,
      },
    };

    const { Items } = await dbClient.send(new QueryCommand(params));
    return (Items ?? []) as Test[];
  },

  incrementPatientsWaiting: async (testId: string): Promise<void> => {
    await dbClient.send(
      new UpdateCommand({
        TableName: testsTable,
        Key: { testId },
        UpdateExpression:
          "SET patientsWaiting = if_not_exists(patientsWaiting, :zero) + :inc",
        ExpressionAttributeValues: {
          ":inc": 1,
          ":zero": 0,
        },
      })
    );
  },

  decrementPatientsWaiting: async (testId: string): Promise<void> => {
    await dbClient.send(
      new UpdateCommand({
        TableName: testsTable,
        Key: { testId },
        UpdateExpression:
          "SET patientsWaiting = if_not_exists(patientsWaiting, :zero) - :dec",
        ConditionExpression: "patientsWaiting > :zero",
        ExpressionAttributeValues: {
          ":dec": 1,
          ":zero": 0,
        },
      })
    );
  },
};
