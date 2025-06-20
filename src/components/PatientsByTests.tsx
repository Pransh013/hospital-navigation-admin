"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getPatientsAction } from "@/actions/patient";
import { getPatientTestsAction } from "@/actions/patientTest";
import { getTestsByHospitalAction } from "@/actions/test";
import { toast } from "sonner";
import { Patient } from "@/models/patient";
import { PatientTest } from "@/models/patientTest";
import { Test } from "@/models/test";

export default function PatientsByTests() {
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);
  const [patientsByTest, setPatientsByTest] = useState<
    Record<
      string,
      Array<{
        patient: Patient;
        patientTest: PatientTest;
      }>
    >
  >({});

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          success: testsSuccess,
          data: testsData,
          error: testsError,
        } = await getTestsByHospitalAction();
        if (!testsSuccess || !testsData) {
          toast.error(testsError || "Failed to load tests");
          return;
        }
        setTests(testsData);
        if (testsData.length > 0) {
          setSelectedTest(testsData[0].testId);
        }

        const {
          success: patientsSuccess,
          data: patients,
          error: patientsError,
        } = await getPatientsAction();
        if (!patientsSuccess || !patients) {
          toast.error(patientsError || "Failed to load patients");
          return;
        }

        const patientTestsPromises = patients.map(async (patient) => {
          const { success, data: patientTests } = await getPatientTestsAction(
            patient.patientId
          );
          if (!success || !patientTests) return null;
          return patientTests.map((pt) => ({ patient, patientTest: pt }));
        });

        const patientTestsResults = await Promise.all(patientTestsPromises);
        const allPatientTests = patientTestsResults.flat().filter(Boolean);

        const groupedPatients = allPatientTests.reduce((acc, curr) => {
          if (!curr) return acc;
          const { patientTest } = curr;
          if (!acc[patientTest.testId]) {
            acc[patientTest.testId] = [];
          }
          acc[patientTest.testId].push(curr);
          return acc;
        }, {} as Record<string, Array<{ patient: Patient; patientTest: PatientTest }>>);

        setPatientsByTest(groupedPatients);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-1/3 px-5 py-4">
        <p>Loading patients...</p>
      </Card>
    );
  }

  const selectedPatients = selectedTest
    ? patientsByTest[selectedTest] || []
    : [];

  return (
    <Card className="w-1/3 px-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="w-full space-y-2">
        <h1 className="text-lg font-semibold">Patients by Test</h1>
        <Select value={selectedTest} onValueChange={setSelectedTest}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Test" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {tests.map((test) => (
              <SelectItem key={test.testId} value={test.testId}>
                {test.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 space-y-2">
        {selectedPatients.length === 0 ? (
          <p className="text-muted-foreground">
            No patients found for this test.
          </p>
        ) : (
          selectedPatients.map(({ patient, patientTest }, idx) => (
            <div
              key={patient.patientId}
              className="p-2 flex items-end justify-between border-b border-dashed"
            >
              <div className="flex gap-1">
                <p className="text-sm font-semibold">{idx + 1}. </p>
                <div>
                  <p className="text-sm font-bold text-secondary">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Status: {patientTest.status}
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {new Date(patientTest.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
