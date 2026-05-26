import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { email, userId } = await request.json();
  if (!email && !userId) {
    return NextResponse.json({ message: "Email or userId is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  let upsertData = { is_active: true, subscribed_at: new Date().toISOString() };
  if (email) upsertData.email = email;
  if (userId) upsertData.onesignal_id = userId;

  // Use email or userId as unique key for upsert
  const onConflict = email ? "email" : "onesignal_id";

  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      upsertData,
      { onConflict }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
