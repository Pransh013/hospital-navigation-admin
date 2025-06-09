"use client";

import Doctor from "@/models/doctor";
import { useState } from "react";
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
import Link from "next/link";

const DoctorsList = ({ doctors }: { doctors: Doctor[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAvailability =
      selectedAvailability === "all" ||
      doctor.availability === selectedAvailability;
    return matchesSearch && matchesAvailability;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search doctors..."
              className="pl-9 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedAvailability}
            onValueChange={setSelectedAvailability}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-full">
            No doctors found.
          </p>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card
              key={doctor.doctorId}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doctor.designation}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-sm font-medium ${
                    doctor.availability === "available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doctor.availability === "available"
                    ? "Available"
                    : "On Leave"}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <Link
                    href={`/doctors/update/${doctor.doctorId}`}
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
          ))
        )}
      </div>
    </>
  );
};

export default DoctorsList;
