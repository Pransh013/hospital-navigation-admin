"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getPatientsAction } from "@/actions/patient";
import { getPatientTestsByHospitalAction } from "@/actions/patientTest";
import { getTestsByHospitalAction } from "@/actions/test";
import { toast } from "sonner";
import { Patient } from "@/models/patient";
import { PatientTest } from "@/models/patientTest";
import { Test } from "@/models/test";

export default function PatientRecordsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<
    {
      patient: Patient;
      test: Test;
      patientTest: PatientTest;
    }[]
  >([]);

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
                <th className="p-2">Booking Date</th>
                <th className="p-2">Created At</th>
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
                    {record.patient.bookingDate
                      ? new Date(
                          record.patient.bookingDate + "T00:00:00"
                        ).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">
                    {new Date(
                      record.patientTest.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
