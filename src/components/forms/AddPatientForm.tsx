"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPatientAction } from "@/actions/patient";
import { assignPatientTestsAction } from "@/actions/patientTest";
import { patientFormSchema, PatientFormType } from "@/lib/validations";
import { Test } from "@/models/test";
import { Package } from "@/models/package";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

export default function AddPatientForm({
  tests,
  packages,
}: {
  tests: Test[];
  packages: Package[];
}) {
  const router = useRouter();
  const form = useForm<PatientFormType>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      tests: [],
      packageId: "",
      assignmentType: "tests",
      gender: "male",
      contactNumber: "",
      address: "",
      consultationRequired: false,
      bookingDate: undefined,
    },
  });

  async function onSubmit(values: PatientFormType) {
    console.log("Values", values);
    try {
      const {
        success,
        data: patientId,
        error,
      } = await createPatientAction(values);
      if (success && patientId) {
        if (
          values.assignmentType === "tests" &&
          values.tests &&
          values.tests.length > 0
        ) {
          await assignPatientTestsAction({
            patientId,
            testIds: values.tests,
          });
        } else if (values.assignmentType === "packages" && values.packageId) {
          const selectedPackage = packages.find(
            (p) => p.packageId === values.packageId
          );
          if (selectedPackage) {
            await assignPatientTestsAction({
              patientId,
              testIds: selectedPackage.testIds,
            });
          }
        }
        toast.success("Patient added successfully");
        form.reset();
        router.push("/patients");
      } else {
        toast.error(error || "Failed to add patient");
      }
    } catch {
      toast.error("Failed to add patient");
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Patient</CardTitle>
          <CardDescription>
            Enter patient details below to add them to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Date</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                    </FormControl>
                    <FormLabel className="mb-0">
                      Doctor Consultation Required?
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Tabs
                defaultValue="tests"
                onValueChange={(value) =>
                  form.setValue("assignmentType", value as "tests" | "packages")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="tests"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Assign Tests
                  </TabsTrigger>
                  <TabsTrigger
                    value="packages"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Assign Package
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="tests">
                  <FormField
                    control={form.control}
                    name="tests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Tests</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {tests.map((test) => (
                            <div
                              key={test.testId}
                              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                            >
                              <Input
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                                value={test.testId}
                                checked={field.value?.includes(test.testId)}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      newValue,
                                    ]);
                                  } else {
                                    field.onChange(
                                      (field.value || []).filter(
                                        (id) => id !== newValue
                                      )
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm font-medium">
                                {test.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="packages">
                  <FormField
                    control={form.control}
                    name="packageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a Package</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {packages.map((pkg) => (
                              <SelectItem
                                key={pkg.packageId}
                                value={pkg.packageId}
                              >
                                {pkg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/patients")}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Patient</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
