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
import type { Company, SuccessResponse, ErrorResponse } from "@/lib/types";

interface EditCompanyDialogProps {
  company: Company;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({
  company,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Company>(company);

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

  const statuses = ["Active", "Inactive", "Pending"];

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 12 digits (09 + 10 digits)
    const limited = digitsOnly.slice(0, 12);
    setFormData({ ...formData, contact_number: limited });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: SuccessResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || "Failed to update company");
      }

      toast.success("Company updated successfully");
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error updating company";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update company information. All fields marked with * are required.
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
            <Label htmlFor="client_name">
              Client Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
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
            <p className="text-xs text-gray-500 mt-1">
              Format: 09XXXXXXXXX (09 followed by 10 digits)
            </p>
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
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Add any remarks (optional)"
              value={formData.remarks ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value || null })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="to_do">To Do</Label>
            <Textarea
              id="to_do"
              placeholder="Add tasks or notes (optional)"
              value={formData.to_do ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, to_do: e.target.value || null })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Updating..." : "Update Company"}
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

export default EditCompanyDialog;
