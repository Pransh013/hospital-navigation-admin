"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addPackageAction } from "@/actions/package";
import { packageFormSchema, PackageFormType } from "@/lib/validations";
import { Test } from "@/models/test";

export function AddPackageForm({ tests }: { tests: Test[] }) {
  const router = useRouter();
  const form = useForm<PackageFormType>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      description: "",
      testIds: [],
      price: "",
    },
  });

  async function onSubmit(values: PackageFormType) {
    try {
      const response = await addPackageAction(values);

      if (response.success) {
        toast.success("Package added successfully");
        form.reset();
        router.push("/packages");
      } else {
        toast.error(response.error || "Failed to add package");
      }
    } catch {
      toast.error("Failed to add package");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Full Body Checkup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="A comprehensive health checkup"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="4999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Tests</FormLabel>
              {tests.length === 0 ? (
                <p className="text-sm text-muted-foreground pt-2">
                  No available tests to select.
                </p>
              ) : (
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
                            field.onChange([...(field.value || []), newValue]);
                          } else {
                            field.onChange(
                              (field.value || []).filter(
                                (id) => id !== newValue
                              )
                            );
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{test.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/packages")}
          >
            Cancel
          </Button>
          <Button type="submit">Add Package</Button>
        </div>
      </form>
    </Form>
  );
}
