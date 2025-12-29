"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Prospect {
  id: number;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  industry: string;
  callStatus: string;
  status: string;
  remark: string;
  dateAdded: string;
}

const mockData: Prospect[] = [
  {
    id: 1,
    companyName: "Acme Corp",
    contactPerson: "Jane Doe",
    contactNumber: "09123456789",
    industry: "Technology",
    callStatus: "Called",
    status: "Prospect",
    remark: "Follow up next week",
    dateAdded: "2025-12-29",
  },
  {
    id: 2,
    companyName: "Law & Co",
    contactPerson: "John Smith",
    contactNumber: "09987654321",
    industry: "Law Firm",
    callStatus: "No Answer",
    status: "Client",
    remark: "Contract signed",
    dateAdded: "2025-12-28",
  },
];

export const ProspectTable = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [callStatusFilter, setCallStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null
  );

  const filteredData = mockData.filter((prospect) => {
    const matchesSearch =
      prospect.companyName.toLowerCase().includes(search.toLowerCase()) ||
      prospect.contactPerson.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || prospect.status === statusFilter;

    const matchesIndustry =
      industryFilter === "all" || prospect.industry === industryFilter;

    const matchesCallStatus =
      callStatusFilter === "all" || prospect.callStatus === callStatusFilter;

    const matchesDate =
      !dateFilter ||
      format(new Date(prospect.dateAdded), "yyyy-MM-dd") ===
        format(dateFilter, "yyyy-MM-dd");

    return (
      matchesSearch &&
      matchesStatus &&
      matchesIndustry &&
      matchesCallStatus &&
      matchesDate
    );
  });

  const refreshTable = () => {
    setSearch("");
    setStatusFilter("all");
    setIndustryFilter("all");
    setCallStatusFilter("all");
    setDateFilter(undefined);
  };

  return (
    <div className="space-y-6 p-5">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:items-end">
        <div className="flex-1 flex flex-col gap-2 lg:max-w-md">
          <Label>Search</Label>
          <Input
            placeholder="Company Name / Contact Person"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl border border-[#355E34] focus-visible:ring-[#355E34] focus-visible:ring-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Status & Industry Filters */}
          <div className="flex flex-col gap-2 w-full lg:w-44">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full rounded-xl border border-[#355E34]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl h-70 overflow-y-auto">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Secured">Secured</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry Filter */}
          <div className="flex flex-col gap-2 w-full lg:w-44">
            <Label>Industry</Label>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="h-11 w-full rounded-xl border border-[#355E34]">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent className="rounded-xl h-70 overflow-y-auto">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Law Firm">Law Firm</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Car / Automotive">
                  Car / Automotive
                </SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="School / Education">
                  School / Education
                </SelectItem>
                <SelectItem value="Travel / Tourism">
                  Travel / Tourism
                </SelectItem>
                <SelectItem value="Cafe / Restaurant">
                  Cafe / Restaurant
                </SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Resort / Hospitality">
                  Resort / Hospitality
                </SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Call Status Filter */}
          <div className="flex flex-col gap-2 w-full lg:w-44">
            <Label>Call Status</Label>
            <Select
              value={callStatusFilter}
              onValueChange={setCallStatusFilter}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border border-[#355E34]">
                <SelectValue placeholder="Select Call Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl h-70 overflow-y-auto">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Called">Called</SelectItem>
                <SelectItem value="No Answer">No Answer</SelectItem>
                <SelectItem value="Not Called">Not Called</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Added Filter */}
          <div className="flex flex-col gap-2 w-full lg:w-44">
            <Label>Date Added</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border border-[#355E34] text-left"
                >
                  {dateFilter
                    ? format(dateFilter, "yyyy-MM-dd")
                    : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end ">
          <Button
            className="h-11 rounded-xl bg-[#355E34] text-white hover:bg-[#2c4c2b]"
            onClick={refreshTable}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#355E34] shadow-md bg-white min-h-100">
        <Table className="w-full">
          <TableHeader className="bg-[#e6f0e9]">
            <TableRow>
              <TableHead className="text-[#355E34]">Edit</TableHead>
              <TableHead className="text-[#355E34]">Company Name</TableHead>
              <TableHead className="text-[#355E34]">Contact Person</TableHead>
              <TableHead className="text-[#355E34]">Contact Number</TableHead>
              <TableHead className="text-[#355E34]">Industry</TableHead>
              <TableHead className="text-[#355E34]">Call Status</TableHead>
              <TableHead className="text-[#355E34]">Status</TableHead>
              <TableHead className="text-[#355E34]">Remark</TableHead>
              <TableHead className="text-[#355E34]">Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((prospect, idx) => (
                <TableRow
                  key={prospect.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-[#f0f6f1]"
                  } hover:bg-[#d9ebd9] transition-colors`}
                >
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-[#355E34] text-[#355E34] hover:bg-[#e6f0e9]"
                        >
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl w-full p-6 overflow-visible">
                        <DialogHeader>
                          <DialogTitle>Edit Prospect</DialogTitle>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex justify-end gap-4">
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="h-11 rounded-xl"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button className="bg-[#355E34] h-11 rounded-xl text-white hover:bg-[#2c4c2b]">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.companyName}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.contactPerson}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.contactNumber}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.industry}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.callStatus}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.status}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {prospect.remark}
                  </TableCell>
                  <TableCell className="text-[#1a3d24]">
                    {format(new Date(prospect.dateAdded), "yyyy-MM-dd")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
