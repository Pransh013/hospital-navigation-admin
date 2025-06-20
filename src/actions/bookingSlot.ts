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

export async function createConsultationSlotAction({
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
}): Promise<ActionResponse<{ slot: BookingSlot }>> {
  try {
    const slot = await bookingSlotService.assignConsultationSlot({
      hospitalId,
      doctorId,
      patientId,
      patientTestId,
      date,
      startTime,
      endTime,
    });
    return { success: true, data: { slot } };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to assign slot" };
  }
}
