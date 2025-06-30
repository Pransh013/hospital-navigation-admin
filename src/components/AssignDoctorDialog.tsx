"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDoctorsAction } from "@/actions/doctor";
import { getAvailableSlots, bookSlotAction } from "@/actions/bookingSlot";
import { toast } from "sonner";
import { Doctor } from "@/models/doctor";
import { BookingSlot } from "@/models/bookingSlot";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssignDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientTestId: string;
  onAssignmentSuccess: () => void;
}

export default function AssignDoctorDialog({
  open,
  onOpenChange,
  patientId,
  patientTestId,
  onAssignmentSuccess,
}: AssignDoctorDialogProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { success, data } = await getDoctorsAction();
      if (success && data) setDoctors(data);
      else toast.error("Failed to load doctors");
    })();
  }, [open]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    (async () => {
      setLoading(true);
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const { success, data, error } = await getAvailableSlots(
        doctors.find((d) => d.doctorId === selectedDoctor)?.hospitalId || "",
        selectedDoctor,
        dateStr
      );
      if (success && data) setSlots(data.slots);
      else {
        setSlots([]);
        toast.error(error || "Failed to load slots");
      }
      setLoading(false);
    })();
  }, [selectedDoctor, selectedDate, doctors]);

  async function handleAssign() {
    if (!selectedDoctor || !selectedSlot || !selectedDate) return;
    setLoading(true);
    const slot = slots.find((s) => s.slotId === selectedSlot);
    if (!slot) return;
    const res = await bookSlotAction({
      hospitalId: slot.hospitalId,
      doctorId: slot.doctorId!,
      patientId,
      patientTestId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Doctor assigned and slot booked!");
      onAssignmentSuccess();
      onOpenChange(false);
    } else {
      toast.error(res.error || "Failed to book slot");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2/3 w-2/3 h-3/4">
        <DialogHeader>
          <DialogTitle>Assign Doctor</DialogTitle>
          <DialogDescription>
            Select a doctor and a date to see available slots.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doc) => (
                <SelectItem key={doc.doctorId} value={doc.doctorId}>
                  {doc.name} ({doc.designation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-8">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
            <div>
              <h4 className="font-medium text-sm mb-2">Available Slots</h4>
              <ScrollArea className="h-72 rounded-md border p-2">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot) => (
                      <Button
                        key={slot.slotId}
                        variant={
                          selectedSlot === slot.slotId ? "default" : "outline"
                        }
                        onClick={() => setSelectedSlot(slot.slotId)}
                        className="w-full"
                      >
                        {slot.startTime} - {slot.endTime}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor && selectedDate
                      ? "No slots available for this day."
                      : "Please select a doctor and a date."}
                  </p>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAssign}
            disabled={!selectedDoctor || !selectedSlot || loading}
          >
            Assign
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
