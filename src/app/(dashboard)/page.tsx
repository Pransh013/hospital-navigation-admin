import DiagnosticTestList from "@/components/DiagnosticTestList";
import PatientList from "@/components/PatientList";
import PatientRecordsTable from "@/components/PatientRecordsTable";

export default function Home() {

  return (
    <div className="flex flex-1 flex-col gap-6 px-24 py-8">
      <div className="flex gap-4 justify-between">
        <DiagnosticTestList />
        <PatientList />
      </div>
      <PatientRecordsTable />
    </div>
  );
}
