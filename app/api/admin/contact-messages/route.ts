import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { withAuth, AuthenticatedHandler } from "@/middleware/withAuth";

const handleGet: AuthenticatedHandler = async (request: NextRequest) => {
  try {
    await connectDB();
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Admin contact messages error:", error);
    return NextResponse.json({ success: false, error: "Failed to load contact messages." }, { status: 500 });
  }
};

export const GET = withAuth(handleGet);
