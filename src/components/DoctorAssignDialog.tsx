"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { doctors } from "@/constants";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DoctorCard from "./DoctorCard";

type DoctorAssignDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelectDoctor: (doctorId: string) => void;
};

export default function DoctorAssignDialog({
  open,
  onClose,
  onSelectDoctor,
}: DoctorAssignDialogProps) {
  const [filter, setFilter] = useState("all");

  const designations = Array.from(
    new Set(doctors.map((doc) => doc.designation))
  );
  const filteredDoctors =
    filter === "all"
      ? doctors
      : doctors.filter((d) => d.designation === filter);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>Select a Doctor</DialogTitle>
          <Select onValueChange={(val) => setFilter(val)} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {designations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogHeader>

        <ScrollArea className="max-h-60">
          <div className="flex flex-wrap justify-between gap-y-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard doctor={doctor} key={doctor.id} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
