"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DiagnosticTest = {
  id: string;
  name: string;
  patientsWaiting: number;
  status: "active" | "closed" | "on-break";
};

export function DiagnosticTestCard({ test }: { test: DiagnosticTest }) {
  return (
    <Card className="border-none shadow-none h-32 w-60 gap-0">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>{test.name}</div>
          <div className="border border-stone-500 rounded-full size-4 flex justify-center items-center">
            <div
              className={`rounded-full size-2.5 ${getStatusColor(
                test.status,
                "bg"
              )}`}
            ></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold">{test.patientsWaiting}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-black/60 font-medium ">Patients Waiting</p>
          <p className={`capitalize text-sm font-semibold ${getStatusColor(test.status, "text")}`}>
            {test.status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const getStatusColor = (status: string, type: "bg" | "text") => {
  const colors = {
    active: {
      bg: "bg-green-600",
      text: "text-green-600",
    },
    closed: {
      bg: "bg-gray-400",
      text: "text-gray-600",
    },
    "on-break": {
      bg: "bg-orange-600",
      text: "text-orange-600",
    },
  };

  return colors[status as keyof typeof colors]?.[type] || "text-gray-400";
};
