"use client";

import { patientRecords } from "@/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorAssignDialog from "@/components/DoctorAssignDialog";
import { CircleCheck, ClipboardPlus, Upload } from "lucide-react";
import { useState } from "react";

export default function PatientRecordsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  function handleUpload(patientId: string) {
    console.log("Upload report for:", patientId);
  }

  function handleAssignDoctor(patientId: string) {
    setSelectedPatientId(patientId);
    setDialogOpen(true);
  }

  return (
    <>
      <DoctorAssignDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelectDoctor={(doctorId) => {
          console.log(
            `Assigning doctor ${doctorId} to patient ${selectedPatientId}`
          );
          setDialogOpen(false);
        }}
      />
      <Card className="p-4 overflow-auto w-full">
        <h2 className="text-xl font-semibold">Patient Records</h2>
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Name</th>
              <th className="p-2">ID</th>
              <th className="p-2">Test</th>
              <th className="p-2">Date</th>
              <th className="p-2">Report</th>
              <th className="p-2">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {patientRecords.map((patient) => (
              <tr key={patient.id} className="border-b">
                <td className="p-2">{patient.name}</td>
                <td className="p-2">{patient.id}</td>
                <td className="p-2">{patient.testName}</td>
                <td className="p-2">{patient.date}</td>

                <td className="p-2">
                  {patient.reportUploaded ? (
                    <div className="flex items-center justify-center gap-1 w-28 py-1.5 bg-[#3CC19A] text-primary-foreground rounded-md shadow-xs">
                      <CircleCheck size={16} />
                      <p>Uploaded</p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-secondary bg-white w-28 cursor-pointer"
                      onClick={() => handleUpload(patient.id)}
                    >
                      <Upload /> Upload
                    </Button>
                  )}
                </td>

                <td className="p-2">
                  {patient.doctorAssigned ? (
                    <div className="flex items-center justify-center gap-1 w-28 py-1.5 bg-[#3CBEC1] text-primary-foreground rounded-md shadow-xs">
                      <CircleCheck size={16} />
                      <p>Assigned</p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary bg-white w-28 cursor-pointer"
                      onClick={() => handleAssignDoctor(patient.id)}
                    >
                      <ClipboardPlus />
                      Assign
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
