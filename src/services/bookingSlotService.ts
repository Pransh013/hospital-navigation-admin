import { bookingSlotRepository } from "@/repositories/bookingSlotRepository";
import {
  BookingSlot,
  SLOT_DURATION,
  WORKING_HOURS,
} from "@/models/bookingSlot";
import { patientRepository } from "@/repositories/patientRepository";

function generateAllPossibleSlots(
  date: string,
  hospitalId: string,
  doctorId: string
): BookingSlot[] {
  const slots: BookingSlot[] = [];
  const current = new Date(`${date}T${WORKING_HOURS.start}:00`);
  const end = new Date(`${date}T${WORKING_HOURS.end}:00`);
  let slotIndex = 0;
  while (current < end) {
    const startTime = current.toTimeString().slice(0, 5);
    current.setMinutes(current.getMinutes() + SLOT_DURATION);
    const endTime = current.toTimeString().slice(0, 5);
    slots.push({
      slotId: `${date}-${doctorId}-${slotIndex}`,
      hospitalId,
      doctorId,
      date,
      startTime,
      endTime,
      status: "available",
      createdAt: "",
      updatedAt: "",
    });
    slotIndex++;
  }
  return slots;
}

export const bookingSlotService = {
  getAvailableDoctorSlots: async (
    hospitalId: string,
    doctorId: string,
    date: string
  ): Promise<BookingSlot[]> => {
    if (!doctorId || !date) return [];
    const allSlots = generateAllPossibleSlots(date, hospitalId, doctorId);
    const bookedSlots = await bookingSlotRepository.findBookedDoctorSlots(
      hospitalId,
      doctorId,
      date
    );
    const bookedTimes = new Set(
      bookedSlots.map((slot) => slot.startTime + "-" + slot.endTime)
    );
    return allSlots.filter(
      (slot) => !bookedTimes.has(slot.startTime + "-" + slot.endTime)
    );
  },

  bookSlot: async (
    hospitalId: string,
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    const now = new Date().toISOString();
    const slot: BookingSlot = {
      slotId: `${date}-${doctorId}-${startTime}`,
      hospitalId,
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
      status: "booked",
      createdAt: now,
      updatedAt: now,
    };
    const booked = await bookingSlotRepository.bookSlot(slot);

    if (booked) {
      await patientRepository.update(patientId, {
        consultationSlotId: slot.slotId,
        doctorId: doctorId,
        updatedAt: now,
      });
    }

    return booked;
  },
};
