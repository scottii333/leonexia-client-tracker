import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const checkAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "1";
};

// GET:  Fetch companies with search, filter, and pagination
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
    const status = searchParams.get("status") || "";

    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    let query = supabaseAdmin
      .from("companies")
      .select("*", { count: "exact" })
      .range(offset, offset + pageSize - 1);

    if (search) {
      query = query.or(
        `company_name. ilike. %${search}%,client_name.ilike.%${search}%`
      );
    }

    if (industry) {
      query = query.eq("industry", industry);
    }

    if (status) {
      query = query.eq("status", status);
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// POST: Create new company
export const POST = async (req: Request) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      company_name,
      client_name,
      contact_number,
      email_address,
      industry,
    } = body;

    // Validation
    if (!company_name?.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }
    if (!client_name?.trim()) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }
    if (!contact_number?.trim()) {
      return NextResponse.json(
        { error: "Contact number is required" },
        { status: 400 }
      );
    }
    if (!email_address?.trim()) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }
    if (!industry?.trim()) {
      return NextResponse.json(
        { error: "Industry is required" },
        { status: 400 }
      );
    }

    // Validate contact number (PH format:  09XXXXXXXXX - 09 followed by 10 digits)
    const phoneRegex = /^09\d{10}$/;
    if (!phoneRegex.test(contact_number)) {
      return NextResponse.json(
        {
          error:
            "Contact number must be 09 followed by 10 digits (e.g., 09918121869)",
        },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_address)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("companies")
      .insert([
        {
          company_name: company_name.trim(),
          client_name: client_name.trim(),
          contact_number: contact_number.trim(),
          email_address: email_address.trim(),
          industry: industry.trim(),
          remarks: null,
          to_do: null,
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
