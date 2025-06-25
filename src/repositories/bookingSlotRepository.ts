import dbClient, { bookingSlotsTable } from "@/lib/db/dynamodb";
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { BookingSlot } from "@/models/bookingSlot";

export const bookingSlotRepository = {
  findBookedDoctorSlots: async (
    hospitalId: string,
    doctorId: string,
    date: string
  ): Promise<BookingSlot[]> => {
    const response = await dbClient.send(
      new QueryCommand({
        TableName: bookingSlotsTable,
        IndexName: "doctorId-date-index",
        KeyConditionExpression: "doctorId = :doc AND #date = :d",
        FilterExpression: "#status = :status AND hospitalId = :hid",
        ExpressionAttributeNames: { "#date": "date", "#status": "status" },
        ExpressionAttributeValues: {
          ":doc": doctorId,
          ":d": date,
          ":status": "booked",
          ":hid": hospitalId,
        },
      })
    );
    return (response.Items || []) as BookingSlot[];
  },

  bookSlot: async (slot: BookingSlot): Promise<boolean> => {
    try {
      await dbClient.send(
        new PutCommand({
          TableName: bookingSlotsTable,
          Item: slot,
          ConditionExpression: "attribute_not_exists(slotId)",
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        return false;
      }
      throw error;
    }
  },
};
