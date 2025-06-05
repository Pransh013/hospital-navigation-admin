import { AppSidebar } from "@/components/AppSidebar";
import DiagnosticTestList from "@/components/DiagnosticTestList";
import PatientList from "@/components/PatientList";
import PatientRecordsTable from "@/components/PatientRecordsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUserAction } from "@/app/actions/auth";

export default async function Home() {
  const { user } = await getCurrentUserAction();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 px-24 py-8">
          <div className="flex gap-4 justify-between">
            <DiagnosticTestList />
            <PatientList />
          </div>
          <PatientRecordsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
