import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const checkAuth = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "1";
};

// GET:  Fetch prospects with search, filter, and pagination
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
    const prospectStatus = searchParams.get("prospectStatus") || "";

    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    let query = supabaseAdmin
      .from("prospects")
      .select("*", { count: "exact" })
      .range(offset, offset + pageSize - 1);

    if (search) {
      query = query.or(
        `company_name. ilike. %${search}%,contact_person.ilike.%${search}%`
      );
    }

    if (industry) {
      query = query.eq("industry", industry);
    }

    if (callStatus) {
      query = query.eq("call_status", callStatus);
    }

    if (prospectStatus) {
      query = query.eq("prospect_status", prospectStatus);
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

// POST: Create new prospect
export const POST = async (req: Request) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      company_name,
      contact_person,
      contact_number,
      email_address,
      industry,
      website,
    } = body;

    // Validation
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

    // Validate contact number (PH format:  09XXXXXXXXX)
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
      .from("prospects")
      .insert([
        {
          company_name: company_name.trim(),
          contact_person: contact_person.trim(),
          contact_number: contact_number.trim(),
          email_address: email_address.trim(),
          industry: industry.trim(),
          website: website?.trim() || null,
          called_count: 0,
          call_status: "Not Called",
          prospect_status: "Prospect",
          notes: null,
          follow_up_date: null,
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
