"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadReportDialog } from "./UploadReportDialog";
import AssignDoctorDialog from "./AssignDoctorDialog";
import { getPatientTestsAction } from "@/actions/patientTest";
import { getPatientsAction } from "@/actions/patient";
import { Patient } from "@/models/patient";

export default function PatientActions() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<Record<string, boolean>>({});
  const [uploadDialog, setUploadDialog] = useState<{
    open: boolean;
    patientId: string | null;
  }>({ open: false, patientId: null });
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    patientId: string | null;
  }>({ open: false, patientId: null });

  async function fetchPatients() {
    setLoading(true);
    const { success, data } = await getPatientsAction();
    if (success && data) setPatients(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  async function checkAllTestsCompleted(patientId: string) {
    setTestStatus((prev) => ({ ...prev, [patientId]: false }));
    const { success, data } = await getPatientTestsAction(patientId);
    if (success && data) {
      const completed =
        data.length > 0 && data.every((t) => t.status === "test_completed");
      setTestStatus((prev) => ({ ...prev, [patientId]: completed }));
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">All Tests Completed</th>
            <th className="p-2 text-left">Report Uploaded</th>
            <th className="p-2 text-left">Consultation Required</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                Loading patients...
              </td>
            </tr>
          ) : (
            patients.map((patient) => {
              const allCompleted = testStatus[patient.patientId];
              return (
                <tr key={patient.patientId} className="border-b">
                  <td className="p-2">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="p-2">
                    {allCompleted === undefined ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          checkAllTestsCompleted(patient.patientId)
                        }
                      >
                        Check
                      </Button>
                    ) : allCompleted ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="p-2">{patient.reportUrl ? "Yes" : "No"}</td>
                  <td className="p-2">
                    {patient.consultationRequired ? "Yes" : "No"}
                  </td>
                  <td className="p-2 flex gap-2">
                    {allCompleted && !patient.reportUrl && (
                      <Button
                        size="sm"
                        onClick={() =>
                          setUploadDialog({
                            open: true,
                            patientId: patient.patientId,
                          })
                        }
                      >
                        Upload Report
                      </Button>
                    )}
                    {patient.reportUrl &&
                      patient.consultationRequired &&
                      !patient.doctorId &&
                      !patient.consultationSlotId && (
                        <Button
                          size="sm"
                          onClick={() =>
                            setAssignDialog({
                              open: true,
                              patientId: patient.patientId,
                            })
                          }
                        >
                          Assign Doctor
                        </Button>
                      )}
                    {patient.reportUrl &&
                      patient.consultationRequired &&
                      (patient.doctorId || patient.consultationSlotId) && (
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Doctor Assigned
                        </span>
                      )}
                    <UploadReportDialog
                      isOpen={
                        uploadDialog.open &&
                        uploadDialog.patientId === patient.patientId
                      }
                      onClose={() =>
                        setUploadDialog({ open: false, patientId: null })
                      }
                      patientId={patient.patientId}
                      onReportUploaded={async () => {
                        await fetchPatients();
                        setUploadDialog({ open: false, patientId: null });
                      }}
                    />
                    <AssignDoctorDialog
                      open={
                        assignDialog.open &&
                        assignDialog.patientId === patient.patientId
                      }
                      onOpenChange={(open) =>
                        setAssignDialog({
                          open,
                          patientId: open ? patient.patientId : null,
                        })
                      }
                      patientId={patient.patientId}
                      onAssignmentSuccess={() =>
                        setAssignDialog({ open: false, patientId: null })
                      }
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
