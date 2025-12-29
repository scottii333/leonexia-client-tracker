import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const checkAuth = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "1";
};

export const GET = async (req: Request) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const industry = searchParams.get("industry") || "";
    const callStatus = searchParams.get("callStatus") || "";
    const status = searchParams.get("status") || "";
    const date = searchParams.get("date") || "";

    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    let query = supabaseAdmin
      .from("prospects")
      .select("*", { count: "exact" })
      .range(offset, offset + pageSize - 1)
      .order("id", { ascending: false });

    if (search) {
      query = query.or(
        `company_name.ilike.%${search}%,contact_person.ilike.%${search}%`
      );
    }

    if (industry) {
      // industry is expected lowercased from client
      query = query.eq("industry", industry);
    }

    if (callStatus) {
      query = query.eq("call_status", callStatus);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (date) {
      // date filter uses date_added column (date)
      query = query.eq("date_added", date);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      data,
      pagination: { page, pageSize, total: count, totalPages },
    });
  } catch (err) {
    console.error("GET /prospects error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: {
      company_name: string;
      contact_person: string;
      contact_number: string;
      email_address?: string;
      industry: string;
    } = await req.json();

    const {
      company_name,
      contact_person,
      contact_number,
      email_address,
      industry,
    } = body;

    // Validation
    if (!company_name?.trim())
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    if (!contact_person?.trim())
      return NextResponse.json(
        { error: "Contact person is required" },
        { status: 400 }
      );
    if (!contact_number?.trim())
      return NextResponse.json(
        { error: "Contact number is required" },
        { status: 400 }
      );
    if (!industry?.trim())
      return NextResponse.json(
        { error: "Industry is required" },
        { status: 400 }
      );

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

    const normalizedCompany = company_name.trim();

    // Check for existing company name (case-insensitive)
    // Using ilike with exact string (no wildcards) performs a case-insensitive equality check.
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("prospects")
      .select("id")
      .ilike("company_name", normalizedCompany)
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

    // Insert with defaults
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("prospects")
      .insert([
        {
          company_name: normalizedCompany,
          contact_person: contact_person.trim(),
          contact_number: contact_number.trim(),
          email_address: email_address?.trim() || null,
          // store industry in lowercase
          industry: industry.trim().toLowerCase(),
          call_status: "Not Called",
          status: "Prospect",
          remark: "No remark",
          date_added: today,
          date_updated: now,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { data: data?.[0], success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /prospects error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
