"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { INDUSTRIES } from "@/lib/industries";

interface ServerProspect {
  id: number | string;
  company_name: string;
  contact_person: string;
  contact_number: string;
  industry?: string | null;
  email_address?: string | null;
  call_status?: string | null;
  status?: string | null;
  remark?: string | null;
  date_added?: string | null;
  date_updated?: string | null;
  [k: string]: unknown;
}

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
  success?: boolean;
}

export const AddProspectsDialog: React.FC = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    contact_person: "",
    contact_number: "09",
    email_address: "",
  });

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "contact_number") {
      let formattedValue = value.replace(/\D/g, "");
      if (!formattedValue.startsWith("09")) formattedValue = "09";
      if (formattedValue.length > 11)
        formattedValue = formattedValue.slice(0, 11);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      // normalize industry to lowercase for storage
      const payload = {
        ...formData,
        industry: formData.industry ? formData.industry.toLowerCase() : "",
      };

      const res: AxiosResponse<ApiResponse<ServerProspect>> = await axios.post(
        "/api/prospects",
        payload
      );

      const created: ServerProspect | null = res.data?.data ?? null;

      toast.success("Prospect added successfully!");

      // clear form
      setFormData({
        company_name: "",
        industry: "",
        contact_person: "",
        contact_number: "09",
        email_address: "",
      });

      // close dialog
      setOpen(false);

      // Dispatch event so other components (ProspectTable) can refresh
      if (typeof window !== "undefined") {
        const evt = new CustomEvent<ServerProspect>("prospect:added", {
          detail: created as ServerProspect,
        });
        window.dispatchEvent(evt);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to add prospect");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#355E34] w-full h-11 rounded-xl hover:bg-[#2c4c2b] transition-all duration-200 shadow-sm hover:shadow-md">
            + Add New Prospect
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl w-full p-6 overflow-visible">
          <form onSubmit={handleSubmit} className="w-full">
            <DialogHeader>
              <DialogTitle>Add Prospect</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new prospect.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-6">
              {/* Company Name + Industry */}
              <div className="flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-6">
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <Label
                    htmlFor="company_name"
                    className="text-sm text-gray-700"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    placeholder="Acme Corporation"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 focus-visible:ring-[#355E34] focus-visible:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="industry" className="text-sm text-gray-700">
                    Industry
                  </Label>
                  <Select
                    name="industry"
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData({ ...formData, industry: value })
                    }
                  >
                    <SelectTrigger
                      id="industry"
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 flex items-center justify-between focus-visible:ring-[#355E34] focus-visible:ring-2"
                    >
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl h-70 overflow-y-auto">
                      {INDUSTRIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Person + Contact Number */}
              <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact_person"
                    className="text-sm text-gray-700"
                  >
                    Contact Person
                  </Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    placeholder="Jane Doe"
                    value={formData.contact_person}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 focus-visible:ring-[#355E34] focus-visible:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact_number"
                    className="text-sm text-gray-700"
                  >
                    Contact Number
                  </Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    placeholder="09xxxxxxxxx"
                    value={formData.contact_number}
                    onChange={handleChange}
                    maxLength={11}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 focus-visible:ring-[#355E34] focus-visible:ring-2"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email_address"
                  className="text-sm text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email_address"
                  name="email_address"
                  type="email"
                  placeholder="jane@acme.com"
                  value={formData.email_address}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 focus-visible:ring-[#355E34] focus-visible:ring-2"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
              <DialogClose asChild>
                <Button variant="outline" className="h-11 rounded-xl">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#355E34] h-11 rounded-xl"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Prospects"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
