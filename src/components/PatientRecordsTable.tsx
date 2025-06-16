"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorAssignDialog from "@/components/DoctorAssignDialog";
import { CircleCheck, ClipboardPlus, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { getPatientsAction } from "@/actions/patient";
import { getPatientTestsAction } from "@/actions/patientTest";
import { getTestsByHospitalAction } from "@/actions/test";
import { toast } from "sonner";
import Patient from "@/models/patient";
import PatientTest from "@/models/patientTest";
import Test from "@/models/test";

export default function PatientRecordsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<
    Array<{
      patient: Patient;
      test: Test;
      patientTest: PatientTest;
    }>
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          success: patientsSuccess,
          data: patients,
          error: patientsError,
        } = await getPatientsAction();
        if (!patientsSuccess || !patients) {
          toast.error(patientsError || "Failed to load patients");
          return;
        }

        const {
          success: testsSuccess,
          data: tests,
          error: testsError,
        } = await getTestsByHospitalAction();
        if (!testsSuccess || !tests) {
          toast.error(testsError || "Failed to load tests");
          return;
        }

        const patientTestsPromises = patients.map(async (patient) => {
          const { success, data: patientTests } = await getPatientTestsAction(
            patient.patientId
          );
          if (!success || !patientTests) return [];

          return patientTests
            .map((pt) => {
              const test = tests.find((t) => t.testId === pt.testId);
              if (!test) return null;
              return { patient, test, patientTest: pt };
            })
            .filter(
              (
                record
              ): record is {
                patient: Patient;
                test: Test;
                patientTest: PatientTest;
              } => record !== null
            );
        });

        const patientTestsResults = await Promise.all(patientTestsPromises);
        const allRecords = patientTestsResults.flat();
        setRecords(allRecords);
      } catch {
        toast.error("Failed to load patient records");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleUpload(patientId: string, testId: string) {
    console.log("Upload report for:", patientId, testId);
  }

  function handleAssignDoctor(patientId: string, testId: string) {
    setSelectedPatientId(patientId);
    setDialogOpen(true);
    console.log("Doctor assigned for:", patientId, testId);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>Loading patient records...</p>
      </div>
    );
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
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Test</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Report</th>
              <th className="p-2">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={`${record.patient.patientId}-${record.test.testId}`}
                className="border-b"
              >
                <td className="p-2">{`${record.patient.firstName} ${record.patient.lastName}`}</td>
                <td className="p-2">{record.test.name}</td>
                <td className="p-2">{record.patientTest.status}</td>
                <td className="p-2">
                  {new Date(record.patientTest.createdAt).toLocaleDateString()}
                </td>

                <td className="p-2">
                  {record.patientTest.reportUrl ? (
                    <div className="flex items-center justify-center gap-1 w-28 py-1.5 bg-[#3CC19A] text-primary-foreground rounded-md shadow-xs">
                      <CircleCheck size={16} />
                      <p>Uploaded</p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-secondary bg-white w-28 cursor-pointer"
                      onClick={() =>
                        handleUpload(
                          record.patient.patientId,
                          record.test.testId
                        )
                      }
                    >
                      <Upload /> Upload
                    </Button>
                  )}
                </td>

                <td className="p-2">
                  {record.patientTest.doctorId ? (
                    <div className="flex items-center justify-center gap-1 w-28 py-1.5 bg-[#3CBEC1] text-primary-foreground rounded-md shadow-xs">
                      <CircleCheck size={16} />
                      <p>Assigned</p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary bg-white w-28 cursor-pointer"
                      onClick={() =>
                        handleAssignDoctor(
                          record.patient.patientId,
                          record.test.testId
                        )
                      }
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
