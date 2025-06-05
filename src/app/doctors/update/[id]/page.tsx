"use client";

import { doctors } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useEffect } from "react";

const updateDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.string().min(1, "Please enter designation"),
  hospital: z.string().min(1, "Please enter hospital name"),
  availability: z.enum(["available", "on-leave"], {
    required_error: "Please select availability",
  }),
});

type UpdateDoctorType = z.infer<typeof updateDoctorSchema>;

type Doctor = {
  id: string;
  name: string;
  designation: string;
  hospital: string;
  availability: "available" | "on-leave";
};

export default function UpdateDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const form = useForm<UpdateDoctorType>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: {
      name: "",
      designation: "",
      hospital: "",
      availability: "available",
    },
  });

  useEffect(() => {
    const doctor = doctors.find((d) => d.id === doctorId) as Doctor;
    if (doctor) {
      form.reset({
        name: doctor.name,
        designation: doctor.designation,
        hospital: doctor.hospital,
        availability: doctor.availability,
      });
    } else {
      toast.error("Doctor not found");
      router.push("/doctors");
    }
  }, [doctorId, form, router]);

  async function onSubmit(values: UpdateDoctorType) {
    try {
      // TODO: Implement the actual API call to update doctor
      console.log("Updating doctor:", values);
      toast.success("Doctor updated successfully");
      router.push("/doctors");
    } catch (err) {
      toast.error("Failed to update doctor");
    }
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
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <FormControl>
                      <Input placeholder="Apollo Hospital" {...field} />
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
