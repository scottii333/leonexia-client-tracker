import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const checkAuth = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "1";
};

interface UpdatePayloadServer {
  company_name: string;
  contact_person: string;
  contact_number: string;
  email_address?: string | null;
  industry: string;
  call_status?: string;
  status?: string;
  remark?: string | null;
  date_updated: string;
  date_added?: string | null;
}

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // unwrap params promise
    const { id } = await params;
    const body = await req.json();

    const {
      company_name,
      contact_person,
      contact_number,
      email_address,
      industry,
      call_status,
      status,
      remark,
      date_added,
    } = body as Partial<UpdatePayloadServer>;

    // Basic Validation
    if (!company_name?.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }
    if (!contact_person?.trim()) {
      return NextResponse.json(
        { error: "Contact person is required" },
        { status: 400 }
      );
    }
    if (!contact_number?.trim()) {
      return NextResponse.json(
        { error: "Contact number is required" },
        { status: 400 }
      );
    }
    if (!industry?.trim()) {
      return NextResponse.json(
        { error: "Industry is required" },
        { status: 400 }
      );
    }

    // Validate PH contact number (09 + 9 digits)
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(contact_number)) {
      return NextResponse.json(
        {
          error:
            "Contact number must be 09 followed by 9 digits (e.g., 09123456789)",
        },
        { status: 400 }
      );
    }

    if (email_address) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_address)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const normalizedCompany = company_name!.trim();

    // Check for duplicate company name (case-insensitive) excluding current record
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("prospects")
      .select("id")
      .ilike("company_name", normalizedCompany) // case-insensitive match
      .neq("id", id)
      .limit(1);

    if (existingError) {
      console.error("Error checking existing company:", existingError);
      return NextResponse.json(
        { error: "Error checking existing company" },
        { status: 500 }
      );
    }

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "A prospect with this company name already exists" },
        { status: 409 }
      );
    }

    const updatePayload: Partial<UpdatePayloadServer> = {
      company_name: normalizedCompany,
      contact_person: contact_person!.trim(),
      contact_number: contact_number!.trim(),
      email_address: email_address?.trim() ?? null,
      // store industry as lowercase
      industry: industry!.trim().toLowerCase(),
      call_status: call_status ?? "Not Called",
      status: status ?? "Prospect",
      remark: remark ?? "",
      date_updated: now,
    };

    // If date_added present, update it (must be YYYY-MM-DD)
    if (date_added) {
      updatePayload.date_added = date_added;
    }

    const { data, error } = await supabaseAdmin
      .from("prospects")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data?.[0], success: true });
  } catch (err) {
    console.error("PUT /prospects/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
