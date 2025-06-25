"use server";

import { bookingSlotService } from "@/services/bookingSlotService";
import { ActionResponse } from "@/lib/validations";
import { BookingSlot } from "@/models/bookingSlot";

export async function getAvailableSlots(
  hospitalId: string,
  doctorId: string,
  date: string
): Promise<ActionResponse<{ slots: BookingSlot[] }>> {
  try {
    const slots = await bookingSlotService.getAvailableDoctorSlots(
      hospitalId,
      doctorId,
      date
    );
    return { success: true, data: { slots } };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch slots" };
  }
}

export async function bookSlotAction({
  hospitalId,
  doctorId,
  patientId,
  patientTestId,
  date,
  startTime,
  endTime,
}: {
  hospitalId: string;
  doctorId: string;
  patientId: string;
  patientTestId: string;
  date: string;
  startTime: string;
  endTime: string;
}): Promise<ActionResponse<null>> {
  try {
    const booked = await bookingSlotService.bookSlot(
      hospitalId,
      doctorId,
      patientId,
      patientTestId,
      date,
      startTime,
      endTime
    );
    if (!booked) {
      return { success: false, error: "Slot already booked" };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to book slot" };
  }
}
