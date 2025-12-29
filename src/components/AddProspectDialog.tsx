"use client";

import React from "react";
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

export const AddProspectsDialog: React.FC = () => {
  return (
    <section className="flex justify-center ">
      <Dialog>
        <form className="w-full max-w-2xl">
          <DialogTrigger asChild>
            <Button className="bg-[#355E34] w-full h-11 rounded-xl hover:bg-[#2c4c2b] transition-all duration-200 shadow-sm hover:shadow-md">
              + Add New Prospect
            </Button>
          </DialogTrigger>

          {/* overflow-visible so dropdown can render below the dialog content */}
          <DialogContent className="sm:max-w-2xl w-full p-6 overflow-visible">
            <DialogHeader>
              <DialogTitle>Add Prospect</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new prospect.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-6">
              {/* Row: Company Name + Industry (mobile stacked, sm:grid-cols-3 for larger screens) */}
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
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 focus-visible:ring-[#355E34] focus-visible:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="industry" className="text-sm text-gray-700">
                    Industry
                  </Label>
                  <Select name="industry">
                    <SelectTrigger
                      id="industry"
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 flex items-center justify-between focus-visible:ring-[#355E34] focus-visible:ring-2"
                    >
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl h-70 overflow-y-auto">
                      <SelectItem value="law">Law Firm</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="car">Car / Automotive</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="school">School / Education</SelectItem>
                      <SelectItem value="travel">Travel / Tourism</SelectItem>
                      <SelectItem value="cafe">Cafe / Restaurant</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="resort">
                        Resort / Hospitality
                      </SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row: Contact Person + Contact Number (mobile stacked, sm:grid-cols-2 for larger screens) */}
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
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white text-sm leading-6 px-4 focus-visible:ring-[#355E34] focus-visible:ring-2"
                  />
                </div>
              </div>

              {/* Email Address */}
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
              <Button type="submit" className="bg-[#355E34] h-11 rounded-xl">
                Save Prospect
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </section>
  );
};
