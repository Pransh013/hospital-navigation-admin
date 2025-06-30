"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updatePatientTestStatusAction } from "@/actions/patientTest";
import { toast } from "sonner";

interface UploadReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientTestId: string;
  onStatusChange: () => void;
}

export function UploadReportDialog({
  isOpen,
  onClose,
  patientTestId,
  onStatusChange,
}: UploadReportDialogProps) {
  const handleUpdateStatus = async () => {
    try {
      const { success, error } = await updatePatientTestStatusAction(
        patientTestId,
        "report_ready"
      );

      if (success) {
        toast.success("Status updated to Report Ready");
        onStatusChange();
        onClose();
      } else {
        toast.error(error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Report</DialogTitle>
          <DialogDescription>
            This is a placeholder for the report upload functionality. For now,
            clicking the button below will mark the test status as &ldquo;Report
            Ready&rdquo;.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Future file upload component will go here.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus}>Mark as Report Ready</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
