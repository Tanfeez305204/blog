import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(_request, { params }) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("blogs").select("views").eq("id", params.id).single();
  await supabase.from("blogs").update({ views: (data?.views || 0) + 1 }).eq("id", params.id);
  return NextResponse.json({ ok: true });
}
