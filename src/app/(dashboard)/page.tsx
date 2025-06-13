import DiagnosticTestList from "@/components/DiagnosticTestList";
import PatientRecordsTable from "@/components/PatientRecordsTable";
import PatientsByTests from "@/components/PatientsByTests";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-24 py-8">
      <div className="flex gap-4 justify-between">
        <DiagnosticTestList />
        <PatientsByTests />
      </div>
      <PatientRecordsTable />
    </div>
  );
}
