import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 || !subject || subject.length > 180 ||
        !message || message.length > 5000 || phone.length > 40) {
      return NextResponse.json({ success: false, error: "Please check the form fields and try again." }, { status: 400 });
    }

    await connectDB();
    const saved = await ContactMessage.create({ name, email, phone, subject, message, status: "new", emailDelivery: "pending" });

    // Email is optional until a verified sender and provider key are configured in Vercel.
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_INBOX_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      await ContactMessage.updateOne({ _id: saved._id }, { $set: { emailDelivery: "not_configured" } });
      return NextResponse.json({ success: true, data: { id: saved._id, emailDelivery: "not_configured" } });
    }

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `ShipX website message: ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\nMessage:\n${message}`,
        }),
      });
      await ContactMessage.updateOne(
        { _id: saved._id },
        { $set: { emailDelivery: emailResponse.ok ? "sent" : "failed" } }
      );
      return NextResponse.json({ success: true, data: { id: saved._id, emailDelivery: emailResponse.ok ? "sent" : "failed" } });
    } catch (emailError) {
      console.error("Contact email delivery failed:", emailError);
      await ContactMessage.updateOne({ _id: saved._id }, { $set: { emailDelivery: "failed" } });
      return NextResponse.json({ success: true, data: { id: saved._id, emailDelivery: "failed" } });
    }
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ success: false, error: "We couldn't save your message right now. Please try again later." }, { status: 500 });
  }
}
