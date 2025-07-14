"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getPatientTestsAction,
  assignPatientTestsAction,
} from "@/actions/patientTest";
import { getPackagesAction } from "@/actions/package";
import { toast } from "sonner";
import type { Patient } from "@/models/patient";
import type { PatientTest } from "@/models/patientTest";
import type { Package } from "@/models/package";
import { getPatientByEmailAction } from "@/actions/patient";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function BookTestsForExistingPatientPage() {
  const [email, setEmail] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [assignedTests, setAssignedTests] = useState<PatientTest[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Helper: Map testId to package name
  function getPackageNameForTest(testId: string): string {
    const pkg = packages.find((p) => p.testIds.includes(testId));
    return pkg ? pkg.name : "Unknown Package";
  }

  async function handleSearch() {
    setLoading(true);
    setPatient(null);
    setAssignedTests([]);
    setSelectedPackages([]);
    setBookingDate(undefined); // Clear booking date on new search
    try {
      const { success, data, error } = await getPatientByEmailAction(email);
      if (!success || !data) {
        toast.error(error || "Patient not found");
        setLoading(false);
        return;
      }
      setPatient(data);
      const { data: patientTests } = await getPatientTestsAction(
        data.patientId
      );
      setAssignedTests(patientTests || []);
      const { data: allPackages } = await getPackagesAction();
      setPackages(allPackages || []);
    } catch {
      toast.error("Failed to fetch patient info");
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignPackages() {
    if (!patient || selectedPackages.length === 0 || !bookingDate) return;
    setLoading(true);
    try {
      // Collect all testIds from selected packages
      const testIds = packages
        .filter((pkg) => selectedPackages.includes(pkg.packageId))
        .flatMap((pkg) => pkg.testIds);
      const { success, error } = await assignPatientTestsAction({
        patientId: patient.patientId,
        testIds,
        bookingDate: bookingDate.toISOString().slice(0, 10),
      });
      if (success) {
        toast.success("Tests assigned successfully");
        const { data: patientTests } = await getPatientTestsAction(
          patient.patientId
        );
        setAssignedTests(patientTests || []);
        setSelectedPackages([]);
      } else {
        toast.error(error || "Failed to assign tests");
      }
    } catch {
      toast.error("Failed to assign tests");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">
          Book Tests for Existing Patient
        </h1>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter patient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleSearch} disabled={loading || !email}>
            Search
          </Button>
        </div>
        {patient && (
          <div className="space-y-4">
            <div className="mb-2">
              <h2 className="font-semibold">Patient Info</h2>
              <p>
                Name: {patient.firstName} {patient.lastName}
              </p>
              <p>Email: {patient.email}</p>
              <p>Contact: {patient.contactNumber}</p>
              <p>Gender: {patient.gender}</p>
              <p>Address: {patient.address}</p>
            </div>
            <div className="mb-2">
              <h2 className="font-semibold">Previously Assigned Packages</h2>
              {assignedTests.length === 0 ? (
                <p className="text-muted-foreground">No tests assigned yet.</p>
              ) : (
                <ul className="list-disc ml-5">
                  {[
                    ...new Set(
                      assignedTests
                        .map((t) => {
                          const pkg = packages.find((p) =>
                            p.testIds.includes(t.testId)
                          );
                          return pkg ? pkg.packageId : null;
                        })
                        .filter(Boolean)
                    ),
                  ].map((packageId) => {
                    const pkg = packages.find((p) => p.packageId === packageId);
                    return pkg ? <li key={pkg.packageId}>{pkg.name}</li> : null;
                  })}
                </ul>
              )}
            </div>
            <div className="mb-2">
              <h2 className="font-semibold">Assign New Packages</h2>
              <div className="mb-2">
                <label className="block font-medium mb-1">Booking Date</label>
                <Calendar
                  mode="single"
                  selected={bookingDate}
                  onSelect={setBookingDate}
                  disabled={{ before: new Date() }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {packages.map((pkg) => (
                  <label
                    key={pkg.packageId}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={pkg.packageId}
                      checked={selectedPackages.includes(pkg.packageId)}
                      onChange={(e) => {
                        const packageId = e.target.value;
                        if (e.target.checked) {
                          setSelectedPackages([...selectedPackages, packageId]);
                        } else {
                          setSelectedPackages(
                            selectedPackages.filter((id) => id !== packageId)
                          );
                        }
                      }}
                      // Disable only if all tests in this package are currently assigned (not completed/cancelled)
                      disabled={pkg.testIds.every((testId) =>
                        assignedTests.some(
                          (t) => t.testId === testId && t.status === "assigned"
                        )
                      )}
                    />
                    <span>{pkg.name}</span>
                  </label>
                ))}
              </div>
              <Button
                className="mt-2"
                onClick={handleAssignPackages}
                disabled={
                  selectedPackages.length === 0 || loading || !bookingDate
                }
              >
                Assign Selected Packages
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
