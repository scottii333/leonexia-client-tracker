import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const checkAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "1";
};

// PUT: Update company
export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      company_name,
      client_name,
      contact_number,
      email_address,
      industry,
      remarks,
      to_do,
      status,
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

    // Validate contact number (PH format: 09XXXXXXXXX - 09 followed by 10 digits)
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
      .update({
        company_name: company_name.trim(),
        client_name: client_name.trim(),
        contact_number: contact_number.trim(),
        email_address: email_address.trim(),
        industry: industry.trim(),
        remarks: remarks?.trim() || null,
        to_do: to_do?.trim() || null,
        status: status || "Active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data?.[0], success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// DELETE:  Delete company
export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const { error } = await supabaseAdmin
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
