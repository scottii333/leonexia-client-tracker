import { NextResponse } from "next/server";

export const POST = async () => {
  const res = NextResponse.json({ success: true });

  res.cookies.delete("auth");

  return res;
};
