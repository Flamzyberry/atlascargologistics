"use client";

import { AnimatedSection, StaggerWrapper, fadeInUp } from "../motion";
import { motion } from "framer-motion";
import { FileText, Truck, MapPin, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Request a Quote",
    description: "Share your shipment details, origin, and destination. Our team can review the information and respond with available options.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Confirm the Details",
    description: "Review the proposed service, charges, and any pickup or drop-off arrangements before confirming your shipment.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Track Your Shipment",
    description: "Use your tracking number to view the latest shipment status and any location updates available for your consignment.",
    icon: MapPin,
  },
  {
    number: "04",
    title: "Receive Delivery Updates",
    description: "Follow the shipment record for status changes and delivery information as updates are added.",
    icon: CheckCircle,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12 text-center sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            Simple Process
          </div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            From your first enquiry to shipment tracking, know what to expect at each step.
          </p>
        </AnimatedSection>

        <StaggerWrapper className="relative">
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent lg:block" />
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative">
                <div className="group relative h-full rounded-2xl border border-slate-200 bg-white p-6 pt-8 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-8">
                  <div className="absolute -top-4 left-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1 text-sm font-bold text-white shadow-sm">
                    {step.number}
                  </div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-orange-50">
                    <step.icon className="h-7 w-7 text-slate-700 transition-colors group-hover:text-orange-600" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">{step.title}</h3>
                  <p className="leading-7 text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-24 z-10 hidden h-6 w-6 items-center justify-center rounded-full border-2 border-orange-200 bg-white lg:flex">
                    <ArrowRight className="h-3 w-3 text-orange-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </StaggerWrapper>
      </div>
    </section>
  );
}
