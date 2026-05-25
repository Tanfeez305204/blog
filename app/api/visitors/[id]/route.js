import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const supabase = getSupabaseAdmin();
    
    // Get client IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Insert visitor record (will ignore if same IP visits same blog again)
    const { error } = await supabase
      .from('visitors')
      .insert({
        blog_id: id,
        visitor_ip: clientIp,
        visitor_agent: userAgent
      }, { onConflict: 'blog_id,visitor_ip' });

    if (error && error.code !== '23505') { // 23505 is unique constraint violation - expected
      console.error('Visitor tracking error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ success: false });
  }
}
