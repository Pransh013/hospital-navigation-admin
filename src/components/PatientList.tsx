"use client";

import { useState } from "react";
import { patients } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function PatientList() {
  const [selectedTest, setSelectedTest] = useState<string>("ECG");

  const filteredPatients = patients.filter((p) => p.test === selectedTest);

  const testOptions = Array.from(new Set(patients.map((p) => p.test)));

  return (
    <Card className=" w-1/3 px-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="w-full space-y-2">
        <h1 className="text-lg font-semibold">Patient List</h1>
        <Select
          value={selectedTest}
          onValueChange={(val) => setSelectedTest(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Test" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {testOptions.map((test) => (
              <SelectItem key={test} value={test}>
                {test}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        {filteredPatients.length === 0 ? (
          <p className="text-muted-foreground">No patients found.</p>
        ) : (
          filteredPatients.map((patient, idx) => (
            <div
              key={patient.id}
              className="p-2 flex items-end justify-between border-b border-dashed"
            >
              <div className="flex gap-1">
                <p className="text-sm font-semibold">{idx + 1}. </p>
                <div>
                  <p className="text-sm font-bold text-secondary">
                    {patient.name}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Joined at: {patient.joinedAt}
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {patient.date}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
