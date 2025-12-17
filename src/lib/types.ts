export interface Prospect {
  id: string;
  company_name: string;
  contact_person: string;
  contact_number: string;
  email_address: string;
  industry: string;
  website: string | null;
  called_count: number;
  last_called_at: string | null;
  call_status: string;
  prospect_status: string;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FetchResponse {
  data: Prospect[];
  pagination: PaginationData;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  data: Prospect;
  success: boolean;
}

export interface FormData {
  company_name: string;
  contact_person: string;
  contact_number: string;
  email_address: string;
  industry: string;
  website: string;
}
