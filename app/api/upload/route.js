import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file) return NextResponse.json({ message: "Missing file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "qalam-blog-studio"
  });

  return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
}
