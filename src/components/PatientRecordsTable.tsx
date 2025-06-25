"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, ClipboardPlus, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { getPatientsAction } from "@/actions/patient";
import { getPatientTestsByHospitalAction } from "@/actions/patientTest";
import { getTestsByHospitalAction } from "@/actions/test";
import { toast } from "sonner";
import { Patient } from "@/models/patient";
import { PatientTest } from "@/models/patientTest";
import { Test } from "@/models/test";
import AssignDoctorDialog from "@/components/AssignDoctorDialog";

export default function PatientRecordsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<
    {
      patient: Patient;
      test: Test;
      patientTest: PatientTest;
    }[]
  >([]);
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    patientId: string | null;
    patientTestId: string | null;
  }>({
    open: false,
    patientId: null,
    patientTestId: null,
  });

  async function fetchAllRecords() {
    try {
      const {
        success: ptSuccess,
        data: patientTests,
        error: ptError,
      } = await getPatientTestsByHospitalAction();

      const {
        success: pSuccess,
        data: patients,
        error: pError,
      } = await getPatientsAction();

      const {
        success: tSuccess,
        data: tests,
        error: tError,
      } = await getTestsByHospitalAction();

      if (
        !ptSuccess ||
        !pSuccess ||
        !tSuccess ||
        !patientTests ||
        !patients ||
        !tests
      ) {
        toast.error(ptError || pError || tError || "Failed to load data");
        return;
      }

      const patientMap = new Map(patients.map((p) => [p.patientId, p]));
      const testMap = new Map(tests.map((t) => [t.testId, t]));

      const joinedRecords = patientTests
        .map((pt) => {
          const patient = patientMap.get(pt.patientId);
          const test = testMap.get(pt.testId);
          if (!patient || !test) return null;
          return { patient, test, patientTest: pt };
        })
        .filter(
          (
            r
          ): r is { patient: Patient; test: Test; patientTest: PatientTest } =>
            r !== null
        );

      setRecords(joinedRecords);
    } catch {
      toast.error("Failed to load patient records");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllRecords();
  }, []);

  function handleUpload(patientId: string, testId: string) {
    console.log("Upload report for:", patientId, testId);
  }

  function handleAssignDoctor(patientId: string, patientTestId: string) {
    setAssignDialog({ open: true, patientId, patientTestId });
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
        {isLoading ? (
          <div className="text-center py-6">Loading patient records...</div>
        ) : (
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
                  <td className="p-2">
                    {`${record.patient.firstName} ${record.patient.lastName}`}
                  </td>
                  <td className="p-2">{record.test.name}</td>
                  <td className="p-2">{record.patientTest.status}</td>
                  <td className="p-2">
                    {new Date(
                      record.patientTest.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {record.patientTest.reportUrl ? (
                      <div className="flex items-center gap-1 w-28 py-1.5 bg-[#3CC19A] text-white rounded-md shadow-xs">
                        <CircleCheck size={16} />
                        <p>Uploaded</p>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-secondary bg-white w-28"
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
                      <div className="flex items-center gap-1 w-28 py-1.5 bg-[#3CBEC1] text-white rounded-md shadow-xs justify-center">
                        <CircleCheck size={16} />
                        <p>Assigned</p>
                      </div>
                    ) : record.patientTest.status === "test_completed" ||
                      record.patientTest.status === "report_ready" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-32"
                        onClick={() =>
                          handleAssignDoctor(
                            record.patient.patientId,
                            record.patientTest.patientTestId
                          )
                        }
                      >
                        <ClipboardPlus className="mr-2 h-4 w-4" />
                        Assign Doctor
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <AssignDoctorDialog
        open={assignDialog.open}
        onOpenChange={(open) =>
          setAssignDialog({ open, patientId: null, patientTestId: null })
        }
        patientId={assignDialog.patientId || ""}
        patientTestId={assignDialog.patientTestId || ""}
        onAssignmentSuccess={fetchAllRecords}
      />
    </>
  );
}
