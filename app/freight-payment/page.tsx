"use client";

import Link from "next/link";
import { Navbar, FooterSection } from "@/components/homepage";
import {
  Plane, Ship, Truck, Package, MapPin, ShieldCheck, ClipboardList,
  CreditCard, ArrowRight, CheckCircle2, CircleDollarSign, Ruler, Weight,
} from "lucide-react";

const freightOptions = [
  {
    icon: Plane,
    title: "Air Freight",
    description: "A practical option for time-sensitive cargo and shipments that need a faster transit route.",
    points: ["Priority and standard options may be available", "Best suited to lighter or urgent cargo", "Transit times depend on route and clearance"],
  },
  {
    icon: Ship,
    title: "Sea Freight",
    description: "A cost-conscious option for larger, heavier, or less time-sensitive shipments.",
    points: ["Suitable for bulk cargo", "Consolidated or full-container options may be available", "Schedules depend on ports and customs clearance"],
  },
  {
    icon: Truck,
    title: "Road Freight",
    description: "Cargo transportation by road for supported domestic and cross-border routes.",
    points: ["Pickup and delivery options depend on location", "Suitable for parcels and larger consignments", "Availability is confirmed with your quote"],
  },
];

const quoteFactors = [
  { icon: MapPin, title: "Route", text: "Pickup location, destination, and service coverage." },
  { icon: Weight, title: "Weight", text: "Actual weight and chargeable weight of the cargo." },
  { icon: Ruler, title: "Dimensions", text: "Package length, width, and height." },
  { icon: Package, title: "Cargo details", text: "Contents, packaging, handling, and any special requirements." },
];

export default function FreightPaymentPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="relative overflow-hidden bg-slate-950 px-5 py-16 text-white sm:py-24">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">ShipX Cargo Logistics</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Freight services &amp; payment information</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Explore shipping options, learn what affects freight charges, and request a quote before confirming your shipment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quote" className="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
              Request a freight quote <ArrowRight size={18} />
            </Link>
            <Link href="/track" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
              Track a shipment
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-sky-700">Shipping options</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Choose the freight method that fits</h2>
          <p className="mt-3 leading-7 text-slate-600">Availability, route coverage, and transit times are confirmed when your shipment is quoted.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {freightOptions.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Icon size={25} /></div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-6 text-slate-600">{item.description}</p>
                <ul className="mt-5 space-y-3">
                  {item.points.map((point) => <li key={point} className="flex gap-2 text-sm leading-5 text-slate-600"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />{point}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-700">Freight pricing</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">What determines your shipping cost?</h2>
            <p className="mt-3 leading-7 text-slate-600">There is no single price for every shipment. Share accurate details so the team can review the route and provide a quote.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quoteFactors.map((item) => {
              const Icon = item.icon;
              return <div key={item.title} className="rounded-xl border border-slate-200 p-5"><Icon size={23} className="text-sky-700" /><h3 className="mt-4 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div>;
            })}
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <strong className="text-slate-900">Please note:</strong> Customs duties, taxes, insurance, storage, remote-area delivery, and special handling may affect the final amount when applicable. Any applicable charges should be explained in the quote or invoice before payment.
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-sky-700">How it works</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">From quote to dispatch</h2>
          <div className="mt-7 space-y-5">
            {[
              ["1", "Submit shipment details", "Tell us the origin, destination, package size, weight, and cargo description."],
              ["2", "Review your quote", "Check the proposed service, estimated timing, and itemized charges before accepting."],
              ["3", "Confirm payment instructions", "Use only the payment method and account details supplied through an official ShipX Cargo Logistics invoice or verified company channel."],
              ["4", "Keep your reference", "Save your receipt and shipment reference so you can follow up or track the consignment."],
            ].map(([number, title, text]) => <div key={number} className="flex gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white">{number}</div><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={26} /></div>
          <h2 className="mt-5 text-2xl font-bold">Payment safety</h2>
          <p className="mt-3 leading-7 text-slate-600">Your quote or invoice should state the amount due and the approved payment instructions. Please verify the details before sending funds.</p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />Request written confirmation of the total charges.</li>
            <li className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />Do not pay to a personal account unless the company has formally verified and authorized it.</li>
            <li className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />Keep your payment receipt and shipment reference.</li>
          </ul>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <CircleDollarSign size={22} className="mt-0.5 shrink-0" />
            Online card payments and bank-transfer details are not shown as active payment options here. Confirm the approved method with ShipX before paying.
          </div>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900">Contact the team about payment <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="bg-sky-700 px-5 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div><h2 className="text-2xl font-bold sm:text-3xl">Ready to move your cargo?</h2><p className="mt-2 max-w-xl text-sky-100">Send your shipment details to receive a quote for your route and cargo.</p></div>
          <Link href="/quote" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-sky-800 transition hover:bg-sky-50"><ClipboardList size={18} /> Get a freight quote</Link>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
