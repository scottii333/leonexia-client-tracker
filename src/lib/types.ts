export interface Company {
  id: string;
  company_name: string;
  client_name: string;
  contact_number: string;
  email_address: string;
  industry: string;
  remarks: string | null;
  to_do: string | null;
  status: string;
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
  data: Company[];
  pagination: PaginationData;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  data: Company;
  success: boolean;
}

export interface FormData {
  company_name: string;
  client_name: string;
  contact_number: string;
  email_address: string;
  industry: string;
}
