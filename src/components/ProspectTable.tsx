"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { INDUSTRIES } from "@/lib/industries";

interface Prospect {
  id: number;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  industry: string; // display string (e.g. "Technology")
  callStatus: string;
  status: string;
  remark: string;
  dateAdded: string;
  dateUpdated?: string | null; // <- ADDED: include dateUpdated
  emailAddress?: string | null;
}

interface ServerProspect {
  id: number | string;
  company_name?: string;
  contact_person?: string;
  contact_number?: string;
  industry?: string; // stored lowercase in DB
  call_status?: string;
  status?: string;
  remark?: string;
  email_address?: string | null;
  date_added?: string | null;
  date_updated?: string | null;
  [k: string]: unknown;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  error?: string;
  success?: boolean;
}

interface UpdatePayload {
  company_name: string;
  contact_person: string;
  contact_number: string;
  email_address?: string | null;
  industry: string; // we will send lowercase to server
  call_status?: string;
  status?: string;
  remark?: string;
  date_added?: string;
}

export const ProspectTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all"); // display string or "all"
  const [callStatusFilter, setCallStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null
  );
  const [editOpen, setEditOpen] = useState(false);

  // data state
  const [data, setData] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Map the lowercase industry from the server to the display string from INDUSTRIES
  const displayIndustryFromServer = (serverIndustry?: string): string => {
    if (!serverIndustry) return "";
    const match = INDUSTRIES.find(
      (i) => i.toLowerCase() === serverIndustry.toLowerCase()
    );
    return match ?? serverIndustry;
  };

  const mapServerToProspect = (item: ServerProspect): Prospect => {
    return {
      id: Number(item.id),
      companyName:
        (item.company_name as string) ?? (item["companyName"] as string) ?? "",
      contactPerson:
        (item.contact_person as string) ??
        (item["contactPerson"] as string) ??
        "",
      contactNumber:
        (item.contact_number as string) ??
        (item["contactNumber"] as string) ??
        "",
      industry: displayIndustryFromServer(item.industry as string),
      callStatus:
        (item.call_status as string) ?? (item["callStatus"] as string) ?? "",
      status: (item.status as string) ?? "",
      remark: (item.remark as string) ?? "",
      dateAdded:
        (item.date_added as string) ?? (item["dateAdded"] as string) ?? "",
      dateUpdated:
        (item.date_updated as string) ??
        (item["dateUpdated"] as string) ??
        null,
      emailAddress:
        (item.email_address as string) ??
        (item["emailAddress"] as string) ??
        undefined,
    };
  };

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return (err.response?.data as { error?: string })?.error ?? err.message;
    }
    if (err instanceof Error) return err.message;
    return String(err);
  };

  const fetchProspects = async (pageToFetch = 1): Promise<void> => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pageToFetch,
      };

      if (search.trim()) params.search = search.trim();
      if (industryFilter !== "all")
        params.industry = (industryFilter as string).toLowerCase(); // send lowercase to server
      if (callStatusFilter !== "all") params.callStatus = callStatusFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (dateFilter) params.date = format(dateFilter, "yyyy-MM-dd");

      const res: AxiosResponse<ApiResponse<ServerProspect[]>> = await axios.get(
        "/api/prospects",
        { params }
      );

      const resData = res.data;
      if (!resData || !Array.isArray(resData.data)) {
        toast.error("Invalid response from server");
        setData([]);
        setTotalPages(null);
        return;
      }

      const mapped = resData.data.map(mapServerToProspect);
      setData(mapped);

      if (
        resData.pagination &&
        typeof resData.pagination.totalPages === "number"
      ) {
        setTotalPages(resData.pagination.totalPages);
      } else {
        setTotalPages(null);
      }
      setPage(pageToFetch);
    } catch (err: unknown) {
      console.error("Failed to fetch prospects:", err);
      toast.error(getErrorMessage(err));
      setData([]);
      setTotalPages(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // reset to first page on filter/search change
    fetchProspects(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, industryFilter, callStatusFilter, dateFilter]);

  // Listen for prospect:added events so we can refresh the table without changing structure
  useEffect(() => {
    const handler = (ev: Event) => {
      const custom = ev as CustomEvent<ServerProspect | null>;
      // you can read custom.detail if you want; we re-fetch to keep data consistent
      fetchProspects(1);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("prospect:added", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("prospect:added", handler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshTable = () => {
    setSearch("");
    setStatusFilter("all");
    setIndustryFilter("all");
    setCallStatusFilter("all");
    setDateFilter(undefined);
    fetchProspects(1);
  };

  const handleOpenEdit = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setEditOpen(true);
  };

  const handleUpdate = async (): Promise<void> => {
    if (!selectedProspect) return;
    setUpdating(true);
    try {
      const payload: UpdatePayload = {
        company_name: selectedProspect.companyName.trim(), // trimmed to match duplicate check
        contact_person: selectedProspect.contactPerson.trim(),
        contact_number: selectedProspect.contactNumber.trim(),
        email_address: selectedProspect.emailAddress ?? null,
        // send lowercase industry to server (normalize)
        industry: selectedProspect.industry
          ? selectedProspect.industry.toLowerCase()
          : "",
        call_status: selectedProspect.callStatus || "Not Called",
        status: selectedProspect.status || "Prospect",
        remark: selectedProspect.remark ?? "",
        date_added: selectedProspect.dateAdded || undefined,
      };

      const res: AxiosResponse<ApiResponse<ServerProspect>> = await axios.put(
        `/api/prospects/${selectedProspect.id}`,
        payload
      );

      if (res.data?.error) {
        throw new Error(res.data.error);
      }

      toast.success("Prospect updated");

      await fetchProspects(page);

      setEditOpen(false);
      setSelectedProspect(null);
    } catch (err: unknown) {
      console.error("Update failed:", err);

      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const filteredData = data; // server-side filtering/pagination handled by API

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
                {INDUSTRIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
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
              <PopoverContent className="w-auto p-2">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  className=""
                />
                <Button
                  className="mt-2 w-full h-10 rounded-xl bg-[#355E34] text-white hover:bg-[#2c4c2b] cursor-pointer"
                  onClick={() => setDateFilter(undefined)}
                >
                  Clear
                </Button>
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-[#355E34] text-[#355E34] hover:bg-[#e6f0e9]"
                      onClick={() => handleOpenEdit(prospect)}
                    >
                      <Edit size={16} />
                    </Button>
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
                    {prospect.dateAdded
                      ? format(new Date(prospect.dateAdded), "yyyy-MM-dd")
                      : ""}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-gray-500"
                >
                  {loading ? "Loading..." : "No data found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Single controlled Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedProspect(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl w-full overflow-visible">
          <DialogHeader>
            <DialogTitle>Edit Prospect</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-100 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-1">
              {/* Company Name */}
              <div className="flex flex-col gap-2">
                <Label>Company Name</Label>
                <Input
                  value={selectedProspect?.companyName || ""}
                  onChange={(e) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, companyName: e.target.value } : prev
                    )
                  }
                  className="h-11 rounded-xl border border-[#355E34] focus-visible:ring-[#355E34] focus-visible:ring-2"
                />
              </div>

              {/* Contact Person */}
              <div className="flex flex-col gap-2">
                <Label>Contact Person</Label>
                <Input
                  value={selectedProspect?.contactPerson || ""}
                  onChange={(e) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, contactPerson: e.target.value } : prev
                    )
                  }
                  className="h-11 rounded-xl border border-[#355E34] focus-visible:ring-[#355E34] focus-visible:ring-2"
                />
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-2">
                <Label>Contact Number</Label>
                <Input
                  value={selectedProspect?.contactNumber || ""}
                  onChange={(e) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, contactNumber: e.target.value } : prev
                    )
                  }
                  className="h-11 rounded-xl border border-[#355E34] focus-visible:ring-[#355E34] focus-visible:ring-2"
                />
              </div>

              {/* Industry */}
              <div className="flex flex-col gap-2">
                <Label>Industry</Label>
                <Select
                  value={selectedProspect?.industry || ""}
                  onValueChange={(value) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, industry: value } : prev
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-[#355E34]">
                    <SelectValue placeholder="Select Industry" />
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

              {/* Call Status */}
              <div className="flex flex-col gap-2">
                <Label>Call Status</Label>
                <Select
                  value={selectedProspect?.callStatus || "all"}
                  onValueChange={(value) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, callStatus: value } : prev
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-[#355E34]">
                    <SelectValue placeholder="Select Call Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl h-70 overflow-y-auto">
                    <SelectItem value="Called">Called</SelectItem>
                    <SelectItem value="No Answer">No Answer</SelectItem>
                    <SelectItem value="Not Called">Not Called</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select
                  value={selectedProspect?.status || "all"}
                  onValueChange={(value) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, status: value } : prev
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-[#355E34]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl h-70 overflow-y-auto">
                    <SelectItem value="Declined">Declined</SelectItem>
                    <SelectItem value="Interested">Interested</SelectItem>
                    <SelectItem value="Secured">Secured</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remark - use Textarea from shadcn */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Remark</Label>
                <Textarea
                  value={selectedProspect?.remark || ""}
                  onChange={(e) =>
                    setSelectedProspect((prev) =>
                      prev ? { ...prev, remark: e.target.value } : prev
                    )
                  }
                  placeholder="Enter remark..."
                  className="h-24 rounded-xl border border-[#355E34] focus-visible:ring-[#355E34] focus-visible:ring-2"
                />
              </div>

              {/* Date Added (read-only) */}
              <div className="flex flex-col gap-2">
                <Label>Date Added</Label>
                <Input
                  value={
                    selectedProspect?.dateAdded
                      ? format(
                          new Date(selectedProspect.dateAdded),
                          "yyyy-MM-dd"
                        )
                      : ""
                  }
                  readOnly
                  className="h-11 w-full rounded-xl border border-[#355E34] bg-[#fafafa] text-[#333]"
                />
              </div>

              {/* Date Updated (read-only) */}
              <div className="flex flex-col gap-2">
                <Label>Date Updated</Label>
                <Input
                  value={
                    selectedProspect?.dateUpdated
                      ? format(
                          new Date(selectedProspect.dateUpdated),
                          "yyyy-MM-dd"
                        )
                      : ""
                  }
                  readOnly
                  className="h-11 w-full rounded-xl border border-[#355E34] bg-[#fafafa] text-[#333]"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6 flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="outline" className="h-11 rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-[#355E34] h-11 rounded-xl text-white hover:bg-[#2c4c2b]"
              onClick={handleUpdate}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
