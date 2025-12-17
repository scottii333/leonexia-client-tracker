"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AddProspectDialog from "./AddProspectDialog";
import EditProspectDialog from "./EditProspectDialog";
import type {
  Prospect,
  PaginationData,
  FetchResponse,
  ErrorResponse,
} from "@/lib/types";

const ProspectsTable = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [callStatus, setCallStatus] = useState<string>("");
  const [prospectStatus, setProspectStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [deletingProspectId, setDeletingProspectId] = useState<string | null>(
    null
  );

  const fetchProspects = async (page: number = 1): Promise<void> => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(industry && { industry }),
        ...(callStatus && { callStatus }),
        ...(prospectStatus && { prospectStatus }),
      });

      const res = await fetch(`/api/prospects?${params}`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorData: ErrorResponse = await res.json();
        throw new Error(errorData.error || "Failed to fetch prospects");
      }

      const responseData: FetchResponse = await res.json();
      setProspects(responseData.data);
      setPagination(responseData.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching prospects";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects(1);
  }, [search, industry, callStatus, prospectStatus]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/prospects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData: ErrorResponse = await res.json();
        throw new Error(errorData.error || "Failed to delete prospect");
      }

      toast.success("Prospect deleted successfully");
      setDeletingProspectId(null);
      fetchProspects(pagination.page);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error deleting prospect";
      toast.error(errorMessage);
    }
  };

  const handleRefresh = (): void => {
    fetchProspects(pagination.page);
  };

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

  const getCallStatusColor = (status: string): string => {
    switch (status) {
      case "Not Called":
        return "bg-gray-100 text-gray-800";
      case "Called":
        return "bg-blue-100 text-blue-800";
      case "No Answer":
        return "bg-yellow-100 text-yellow-800";
      case "Interested":
        return "bg-green-100 text-green-800";
      case "Not Interested":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProspectStatusColor = (status: string): string => {
    switch (status) {
      case "Prospect":
        return "bg-purple-100 text-purple-800";
      case "Declined":
        return "bg-red-100 text-red-800";
      case "Not Sure":
        return "bg-orange-100 text-orange-800";
      case "Secured Client":
        return "bg-green-100 text-green-800";
      case "Ongoing Client":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <AddProspectDialog onSuccess={() => fetchProspects(1)} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div>
          <Label htmlFor="search" className="text-sm">
            Search Company or Contact
          </Label>
          <Input
            id="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="industry" className="text-sm">
            Industry
          </Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="All Industries" />
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
          <Label htmlFor="callStatus" className="text-sm">
            Call Status
          </Label>
          <Select value={callStatus} onValueChange={setCallStatus}>
            <SelectTrigger id="callStatus">
              <SelectValue placeholder="All Call Status" />
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
          <Label htmlFor="prospectStatus" className="text-sm">
            Prospect Status
          </Label>
          <Select value={prospectStatus} onValueChange={setProspectStatus}>
            <SelectTrigger id="prospectStatus">
              <SelectValue placeholder="All Prospect Status" />
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

        <div className="flex items-end">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Contact Person</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Industry</TableHead>
              <TableHead className="font-semibold">Call Status</TableHead>
              <TableHead className="font-semibold">Prospect Status</TableHead>
              <TableHead className="font-semibold">Called</TableHead>
              <TableHead className="font-semibold">Last Called</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-gray-500"
                >
                  No prospects found
                </TableCell>
              </TableRow>
            ) : (
              prospects.map((prospect) => (
                <TableRow key={prospect.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {prospect.company_name}
                  </TableCell>
                  <TableCell>{prospect.contact_person}</TableCell>
                  <TableCell className="text-sm">
                    {prospect.contact_number}
                  </TableCell>
                  <TableCell className="text-sm">
                    {prospect.email_address}
                  </TableCell>
                  <TableCell className="text-sm">{prospect.industry}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getCallStatusColor(
                        prospect.call_status
                      )}`}
                    >
                      {prospect.call_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getProspectStatusColor(
                        prospect.prospect_status
                      )}`}
                    >
                      {prospect.prospect_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {prospect.called_count}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {prospect.last_called_at
                      ? new Date(prospect.last_called_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProspect(prospect)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingProspectId(prospect.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    pagination.page > 1 && fetchProspects(pagination.page - 1)
                  }
                  className={
                    pagination.page === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => fetchProspects(pageNum)}
                    isActive={pagination.page === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    pagination.page < pagination.totalPages &&
                    fetchProspects(pagination.page + 1)
                  }
                  className={
                    pagination.page === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {editingProspect && (
        <EditProspectDialog
          prospect={editingProspect}
          onClose={() => setEditingProspect(null)}
          onSuccess={() => {
            setEditingProspect(null);
            fetchProspects(pagination.page);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingProspectId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingProspectId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prospect</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prospect? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingProspectId) {
                  handleDelete(deletingProspectId);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProspectsTable;
