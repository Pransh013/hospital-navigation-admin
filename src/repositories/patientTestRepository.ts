import dbClient, { patientTestsTable } from "@/lib/db/dynamodb";
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import PatientTest from "@/models/patientTest";

// TODO: Optimize GSI structure
// Consider updating the patientId-index GSI to use a composite key:
// - Partition key: patientId
// - Sort key: testId
// This would allow:
// 1. Efficient queries by patientId only (findByPatientId)
// 2. Efficient queries by both patientId and testId (delete)
// 3. No need for filter expressions
// 4. Better performance and cost efficiency

export const patientTestRepository = {
  create: async (patientTest: PatientTest): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: patientTestsTable,
        Item: patientTest,
      })
    );
  },

  createMany: async (patientTests: PatientTest[]): Promise<void[]> => {
    return Promise.all(
      patientTests.map((pt) => patientTestRepository.create(pt))
    );
  },

  findByPatientId: async (patientId: string): Promise<PatientTest[]> => {
    const response = await dbClient.send(
      new QueryCommand({
        TableName: patientTestsTable,
        IndexName: "patientId-index",
        KeyConditionExpression: "patientId = :patientId",
        ExpressionAttributeValues: {
          ":patientId": patientId,
        },
      })
    );

    return (response.Items || []) as PatientTest[];
  },

  delete: async (patientId: string, testId: string): Promise<void> => {
    const response = await dbClient.send(
      new QueryCommand({
        TableName: patientTestsTable,
        IndexName: "patientId-index",
        KeyConditionExpression: "patientId = :patientId",
        FilterExpression: "testId = :testId",
        ExpressionAttributeValues: {
          ":patientId": patientId,
          ":testId": testId,
        },
      })
    );

    if (!response.Items || response.Items.length === 0) {
      throw new Error("Patient test not found");
    }

    const patientTestId = response.Items[0].patientTestId;

    await dbClient.send(
      new DeleteCommand({
        TableName: patientTestsTable,
        Key: {
          patientTestId,
        },
      })
    );
  },
};
