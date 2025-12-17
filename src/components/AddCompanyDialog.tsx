"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { FormData, SuccessResponse, ErrorResponse } from "@/lib/types";

interface AddCompanyDialogProps {
  onSuccess: () => void;
}

const AddCompanyDialog: React.FC<AddCompanyDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    client_name: "",
    contact_number: "",
    email_address: "",
    industry: "",
  });

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
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: SuccessResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || "Failed to add company");
      }

      toast.success("Company added successfully");
      setFormData({
        company_name: "",
        client_name: "",
        contact_number: "",
        email_address: "",
        industry: "",
      });
      setOpen(false);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error adding company";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">+ Add New Company</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Fill in the company details below. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company_name">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company_name"
              placeholder="Enter company name"
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
              placeholder="Enter client name"
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
              placeholder="09918121869"
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
              placeholder="Enter email address"
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
                <SelectValue placeholder="Select an industry" />
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Company"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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

export default AddCompanyDialog;
