"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Prospect, SuccessResponse, ErrorResponse } from "@/lib/types";

interface EditProspectDialogProps {
  prospect: Prospect;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProspectDialog: React.FC<EditProspectDialogProps> = ({
  prospect,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Prospect>(prospect);

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
    "Hospitality",
    "Real Estate",
    "Energy",
    "Other",
  ];

  const callStatuses = [
    "Not Called",
    "Called",
    "No Answer",
    "Interested",
    "Not Interested",
  ];
  const prospectStatuses = [
    "Prospect",
    "Declined",
    "Not Sure",
    "Secured Client",
    "Ongoing Client",
  ];

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, "");
    const limited = digitsOnly.slice(0, 12);
    setFormData({ ...formData, contact_number: limited });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/prospects/${prospect.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: SuccessResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || "Failed to update prospect");
      }

      toast.success("Prospect updated successfully");
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error updating prospect";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Prospect</DialogTitle>
          <DialogDescription>
            Update prospect information. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company_name">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_person">
              Contact Person <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) =>
                setFormData({ ...formData, contact_person: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_number">
              Contact Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact_number"
              value={formData.contact_number}
              onChange={handleContactNumberChange}
              disabled={isLoading}
              required
              maxLength={12}
            />
            <p className="text-xs text-gray-500 mt-1">Format: 09XXXXXXXXX</p>
          </div>

          <div>
            <Label htmlFor="email_address">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email_address"
              type="email"
              value={formData.email_address}
              onChange={(e) =>
                setFormData({ ...formData, email_address: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="industry">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.industry}
              onValueChange={(value) =>
                setFormData({ ...formData, industry: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="industry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value || null })
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="call_status">Call Status</Label>
            <Select
              value={formData.call_status}
              onValueChange={(value) =>
                setFormData({ ...formData, call_status: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="call_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {callStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prospect_status">Prospect Status</Label>
            <Select
              value={formData.prospect_status}
              onValueChange={(value) =>
                setFormData({ ...formData, prospect_status: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="prospect_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prospectStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add call notes or follow-up information"
              value={formData.notes ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value || null })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="follow_up_date">Follow-up Date</Label>
            <Input
              id="follow_up_date"
              type="date"
              value={
                formData.follow_up_date
                  ? formData.follow_up_date.split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  follow_up_date: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              disabled={isLoading}
            />
          </div>

          <div className="bg-gray-100 p-3 rounded-md text-sm">
            <p>
              <strong>Called Count:</strong> {formData.called_count}
            </p>
            <p>
              <strong>Last Called:</strong>{" "}
              {formData.last_called_at
                ? new Date(formData.last_called_at).toLocaleDateString()
                : "Never"}
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Updating..." : "Update Prospect"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProspectDialog;
