"use client";

import { StaggerWrapper, fadeInUp } from "../motion";
import { ClipboardList, MapPin, Package, Truck } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    title: "Shipment updates",
    description: "Check the latest status available for your shipment.",
    href: "/track",
    icon: MapPin,
  },
  {
    title: "Freight options",
    description: "Explore shipping and freight service information.",
    href: "/freight-payment",
    icon: Truck,
  },
  {
    title: "Request a quote",
    description: "Share your shipment details to request pricing.",
    href: "/quote",
    icon: ClipboardList,
  },
  {
    title: "Shipping support",
    description: "Get in touch with the ShipX Cargo Logistics team.",
    href: "/contact",
    icon: Package,
  },
];

export function StatsSection() {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.title}
                href={item.href}
                variants={fadeInUp}
                custom={index * 0.1}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-orange-300 hover:bg-orange-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-orange-700">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </motion.a>
            );
          })}
        </StaggerWrapper>
      </div>
    </section>
  );
}
