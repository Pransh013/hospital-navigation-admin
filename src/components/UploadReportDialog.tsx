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
import { updatePatientReportUrlAction } from "@/actions/patient";
import { toast } from "sonner";

interface UploadReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onReportUploaded: () => void;
}

export function UploadReportDialog({
  isOpen,
  onClose,
  patientId,
  onReportUploaded,
}: UploadReportDialogProps) {
  const handleUploadReport = async () => {
    try {
      // Simulate uploading and getting a report URL
      const reportUrl = `https://dummy-report-url.com/report/${patientId}.pdf`;
      const { success, error } = await updatePatientReportUrlAction(
        patientId,
        reportUrl
      );
      if (success) {
        toast.success("Report uploaded and patient updated");
        onReportUploaded();
        onClose();
      } else {
        toast.error(error || "Failed to update report");
      }
    } catch {
      toast.error("Failed to update report");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Report</DialogTitle>
          <DialogDescription>
            This is a placeholder for the report upload functionality. For now,
            clicking the button below will upload a dummy report and update the
            patient.
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
          <Button onClick={handleUploadReport}>Upload Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
