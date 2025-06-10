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
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatientAction, updatePatientAction } from "@/actions/patient";
import { patientFormSchema, PatientFormType } from "@/lib/validations";

export default function UpdatePatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PatientFormType>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "male",
      contactNumber: "",
      address: "",
    },
  });

  useEffect(() => {
    async function fetchPatient() {
      try {
        const {
          success,
          data: patient,
          error,
        } = await getPatientAction(patientId);
        if (success && patient) {
          form.reset({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            gender: patient.gender,
            contactNumber: patient.contactNumber,
            address: patient.address,
          });
        } else {
          toast.error(error || "Patient not found");
          router.push("/patients");
        }
      } catch (error) {
        toast.error("Failed to fetch patient");
        router.push("/patients");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatient();
  }, [patientId, form, router]);

  async function onSubmit(values: PatientFormType) {
    try {
      const { success, error } = await updatePatientAction(patientId, values);
      if (success) {
        toast.success("Patient updated successfully");
        router.push("/patients");
      } else {
        toast.error(error || "Failed to update patient");
      }
    } catch (err) {
      toast.error("Failed to update patient");
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading patient details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Patient</CardTitle>
          <CardDescription>Update patient information below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
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
                        <Input placeholder="Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
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
                <Button type="submit">Update Patient</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
