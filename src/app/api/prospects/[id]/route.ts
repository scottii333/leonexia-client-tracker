import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const checkAuth = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value === "1";
};

// PUT: Update prospect
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      company_name,
      contact_person,
      contact_number,
      email_address,
      industry,
      website,
      call_status,
      prospect_status,
      notes,
      follow_up_date,
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

    // Validate contact number
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

    const updatedCalledCount =
      call_status === "Called"
        ? (body.called_count || 0) + 1
        : body.called_count || 0;

    const { data, error } = await supabaseAdmin
      .from("prospects")
      .update({
        company_name: company_name.trim(),
        contact_person: contact_person.trim(),
        contact_number: contact_number.trim(),
        email_address: email_address.trim(),
        industry: industry.trim(),
        website: website?.trim() || null,
        call_status: call_status || "Not Called",
        prospect_status: prospect_status || "Prospect",
        called_count: updatedCalledCount,
        last_called_at:
          call_status === "Called"
            ? new Date().toISOString()
            : body.last_called_at,
        notes: notes?.trim() || null,
        follow_up_date: follow_up_date || null,
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

// DELETE: Delete prospect
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("prospects")
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
