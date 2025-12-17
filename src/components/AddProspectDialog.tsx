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

interface AddProspectDialogProps {
  onSuccess: () => void;
}

const AddProspectDialog: React.FC<AddProspectDialogProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    contact_person: "",
    contact_number: "",
    email_address: "",
    industry: "",
    website: "",
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
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: SuccessResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || "Failed to add prospect");
      }

      toast.success("Prospect added successfully");
      setFormData({
        company_name: "",
        contact_person: "",
        contact_number: "",
        email_address: "",
        industry: "",
        website: "",
      });
      setOpen(false);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error adding prospect";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">+ Add New Prospect</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Prospect</DialogTitle>
          <DialogDescription>
            Add a new prospect for cold calling. Fields marked with * are
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
            <Label htmlFor="contact_person">
              Contact Person <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact_person"
              placeholder="Enter contact person name"
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

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://example.com (optional)"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Prospect"}
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

export default AddProspectDialog;
