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
import { getDoctorAction, updateDoctorAction } from "@/actions/doctor";
import { doctorFormSchema, DoctorFormType } from "@/lib/validations";

export default function UpdateDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.doctorId as string;
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<DoctorFormType>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      designation: "",
      availability: "available",
    },
  });

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const { success, data: doctor, error } = await getDoctorAction(doctorId);
        if (success && doctor) {
          form.reset({
            name: doctor.name,
            designation: doctor.designation,
            availability: doctor.availability,
          });
        } else {
          toast.error(error || "Doctor not found");
          router.push("/doctors");
        }
      } catch (error) {
        toast.error("Failed to fetch doctor");
        router.push("/doctors");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoctor();
  }, [doctorId, form, router]);

  async function onSubmit(values: DoctorFormType) {
    try {
      const { success, error } = await updateDoctorAction(doctorId, values);
      if (success) {
        toast.success("Doctor updated successfully");
        router.push("/doctors");
      } else {
        toast.error(error || "Failed to update doctor");
      }
    } catch (err) {
      toast.error("Failed to update doctor");
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading doctor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Doctor</CardTitle>
          <CardDescription>Update doctor information below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Cardiologist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/doctors")}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Doctor</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
