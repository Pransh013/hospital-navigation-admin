"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { Patient } from "@/models/patient";

export default function PatientsList({
  patients = [],
}: {
  patients: Patient[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");

  const filteredPatients = (patients || []).filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesGender =
      selectedGender === "all" || patient.gender === selectedGender;
    return matchesSearch && matchesGender;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search patients..."
              className="pl-9 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No patients found
          </p>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.patientId}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {patient.firstName} {patient.lastName}
                  </h3>
                </div>
                <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  {patient.gender}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <p>Email: {patient.email}</p>
                  <p>Contact: {patient.contactNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/patients/update/${patient.patientId}`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
