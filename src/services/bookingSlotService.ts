import { v4 as uuidv4 } from "uuid";
import { bookingSlotRepository } from "@/repositories/bookingSlotRepository";
import { patientTestRepository } from "@/repositories/patientTestRepository";
import { BookingSlot } from "@/models/bookingSlot";

export const bookingSlotService = {
  getAvailableDoctorSlots: async (
    hospitalId: string,
    doctorId: string,
    date: string
  ) => {
    return bookingSlotRepository.findAvailableDoctorSlots(
      hospitalId,
      doctorId,
      date
    );
  },

  assignConsultationSlot: async (params: {
    hospitalId: string;
    doctorId: string;
    patientId: string;
    patientTestId: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<BookingSlot> => {
    const slot: BookingSlot = {
      slotId: uuidv4(),
      hospitalId: params.hospitalId,
      doctorId: params.doctorId,
      patientId: params.patientId,
      date: params.date,
      startTime: params.startTime,
      endTime: params.endTime,
      status: "booked",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await bookingSlotRepository.createSlot(slot);

    await patientTestRepository.updateConsultationDetails({
      patientTestId: params.patientTestId,
      doctorId: params.doctorId,
      slotId: slot.slotId,
    });

    return slot;
  },
};
