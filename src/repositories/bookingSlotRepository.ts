import dbClient, { bookingSlotsTable } from "@/lib/db/dynamodb";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { BookingSlot } from "@/models/bookingSlot";

export const bookingSlotRepository = {
  findAvailableDoctorSlots: async (
    hospitalId: string,
    doctorId: string,
    date: string
  ): Promise<BookingSlot[]> => {
    const response = await dbClient.send(
      new QueryCommand({
        TableName: bookingSlotsTable,
        IndexName: "doctorId-date-index", // Required GSI (doctorId + date)
        KeyConditionExpression: "doctorId = :doc AND date = :d",
        FilterExpression: "status = :status AND hospitalId = :hid",
        ExpressionAttributeValues: {
          ":doc": doctorId,
          ":d": date,
          ":status": "available",
          ":hid": hospitalId,
        },
      })
    );
    return (response.Items || []) as BookingSlot[];
  },

  createSlot: async (slot: BookingSlot): Promise<void> => {
    await dbClient.send(
      new PutCommand({
        TableName: bookingSlotsTable,
        Item: slot,
      })
    );
  },

  markSlotBooked: async (slotId: string): Promise<void> => {
    await dbClient.send(
      new UpdateCommand({
        TableName: bookingSlotsTable,
        Key: { slotId },
        UpdateExpression: "SET #status = :booked",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":booked": "booked" },
      })
    );
  },
};
