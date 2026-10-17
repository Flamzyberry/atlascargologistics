"use client";

import { useEffect, useState } from "react";

type Message = {
  _id: string; name: string; email: string; phone?: string;
  subject: string; message: string; status: string;
  emailDelivery: string; createdAt: string;
};

export default function ContactInboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/contact-messages")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Unable to load messages.");
        setMessages(data.data || []);
      })
      .catch((err) => setError(err.message || "Unable to load messages."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contact Inbox</h1>
        <p className="mt-2 text-slate-600">Messages submitted through the public ShipX contact form.</p>
      </div>
      {loading && <p className="text-slate-600">Loading messages…</p>}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error} If you are not signed in as an administrator, sign in and reload.</p>}
      {!loading && !error && messages.length === 0 && <p className="rounded-lg bg-slate-50 p-6 text-slate-600">No contact messages yet.</p>}
      <div className="space-y-4">
        {messages.map((item) => (
          <article key={item._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{item.subject}</h2>
                <p className="text-sm text-slate-600">{item.name} · <a className="text-blue-700 underline" href={`mailto:${item.email}`}>{item.email}</a>{item.phone ? ` · ${item.phone}` : ""}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-xs text-slate-600">
                <p>Message: <strong>{item.status}</strong></p>
                <p>Email: <strong>{item.emailDelivery.replaceAll("_", " ")}</strong></p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-slate-800">{item.message}</p>
            <a className="mt-4 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white" href={`mailto:${item.email}?subject=${encodeURIComponent("Re: " + item.subject)}`}>Reply by email</a>
          </article>
        ))}
      </div>
    </main>
  );
}
