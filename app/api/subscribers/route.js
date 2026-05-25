import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      { email, is_active: true, subscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
