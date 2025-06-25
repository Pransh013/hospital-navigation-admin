export type SlotStatus = "available" | "booked" | "completed" | "cancelled";

export interface BookingSlot {
  slotId: string; // Partition Key
  hospitalId: string;
  doctorId?: string; // GSI -> doctorId-date-index
  patientId?: string; // GSI -> patientId-index
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  createdAt: string;
  updatedAt: string;
}

export const SLOT_DURATION = 15;
export const WORKING_HOURS = {
  start: "10:00",
  end: "17:00",
};
