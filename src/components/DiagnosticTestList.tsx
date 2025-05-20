"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { diagnosticTests } from "@/constants";
import { DiagnosticTestCard } from "./DiagnosticTestCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 4;

export default function DiagnosticTestList() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(diagnosticTests.length / PAGE_SIZE);

  const paginatedTests = diagnosticTests.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div className="w-fit flex flex-col gap-2 justify-center">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-lg font-medium">Tests</h1>
        <div className="flex justify-between items-center gap-3">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="rounded-full p-1 bg-transparent border-2 border-black disabled:border-gray-400 cursor-pointer"
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-10 w-10 text-black disabled:text-gray-400" />
          </Button>
          <Button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page >= totalPages - 1}
            className="rounded-full p-1 bg-transparent border-2 border-black/80 disabled:border-gray-400 cursor-pointer"
            size="icon"
            variant="outline"
          >
            <ChevronRight className="h-10 w-10 text-black/90 disabled:text-gray-400" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
        {paginatedTests.map((test) => (
          <DiagnosticTestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}

// ChevronRight
// ChevronLeft
