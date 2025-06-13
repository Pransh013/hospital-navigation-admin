"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DiagnosticTestCard } from "./DiagnosticTestCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHospitalTestStatusesAction } from "@/actions/testStatus";
import { getTestsByHospitalAction } from "@/actions/test";
import { getCurrentAdminAction } from "@/actions/admin";
import { toast } from "sonner";
import Test from "@/models/test";
import TestStatus from "@/models/testStatus";

const PAGE_SIZE = 4;

export default function DiagnosticTestList() {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState<Array<Test & { status: TestStatus }>>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current admin for hospitalId
        const {
          success: adminSuccess,
          data: admin,
          error: adminError,
        } = await getCurrentAdminAction();
        if (!adminSuccess || !admin) {
          toast.error(adminError || "Failed to get admin details");
          return;
        }

        // Get all tests
        const {
          success: testsSuccess,
          data: testsData,
          error: testsError,
        } = await getTestsByHospitalAction();
        if (!testsSuccess || !testsData) {
          toast.error(testsError || "Failed to load tests");
          return;
        }

        // Get test statuses
        const {
          success: statusSuccess,
          data: statusData,
          error: statusError,
        } = await getHospitalTestStatusesAction(admin.hospitalId);
        if (!statusSuccess || !statusData) {
          toast.error(statusError || "Failed to load test statuses");
          return;
        }

        // Combine test data with status
        const combinedData = testsData.map((test) => {
          const status = statusData.find((s) => s.testId === test.testId);
          return {
            ...test,
            status: status || {
              testId: test.testId,
              hospitalId: admin.hospitalId,
              status: "active",
              patientsWaiting: 0,
              updatedAt: new Date().toISOString(),
            },
          };
        });

        setTests(combinedData);
      } catch (error) {
        toast.error("Failed to load diagnostic tests");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalPages = Math.ceil(tests.length / PAGE_SIZE);
  const paginatedTests = tests.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  if (isLoading) {
    return (
      <div className="w-fit flex flex-col gap-2 justify-center">
        <div className="flex justify-between items-center px-1">
          <h1 className="text-lg font-medium">Tests</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 w-60 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

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
          <DiagnosticTestCard
            key={test.testId}
            test={{
              id: test.testId,
              name: test.name,
              patientsWaiting: test.status.patientsWaiting,
              status: test.status.status,
            }}
          />
        ))}
      </div>
    </div>
  );
}
