"use client";

import { patients } from "@/constants";
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

export default function PatientsPage() {
  const testTypes = Array.from(new Set(patients.map((p) => p.test)));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState("all");

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTest = selectedTest === "all" || patient.test === selectedTest;
    return matchesSearch && matchesTest;
  });

  return (
    <div className="container mx-auto py-8">
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
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by test" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              {testTypes.map((test) => (
                <SelectItem key={test} value={test}>
                  {test}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {patient.id}
                </p>
              </div>
              <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                {patient.test}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <div>
                <p>Joined: {patient.joinedAt}</p>
                <p>Date: {patient.date}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/patients/update/${patient.id}`}
                  className="text-primary hover:underline"
                >
                  Edit
                </Link>
                <button className="text-primary hover:underline">
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
