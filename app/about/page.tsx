"use client";

import { motion } from "framer-motion";
import { Navbar, FooterSection } from "@/components/homepage";
import { Target, Users, Globe, Award, TrendingUp, Shield } from "lucide-react";
import NextImage from "next/image";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "ShipX Cargo Logistics";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">About {COMPANY_NAME}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Shipping and logistics support focused on clear communication, practical options, and helping customers understand their shipment requirements.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="bg-orange-50 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-6"><Target className="h-6 w-6 text-white" /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To make shipment enquiries and logistics planning clearer through responsive communication, transparent quotations, and practical guidance at each step.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="bg-blue-50 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-6"><Globe className="h-6 w-6 text-white" /></div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To build lasting customer relationships by communicating clearly about shipment options, requirements, and delivery expectations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "Clear", label: "Shipment Information" },
              { value: "Quote", label: "Request-Based Pricing" },
              { value: "Track", label: "Shipment Lookup" },
              { value: "Support", label: "Customer Enquiries" },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide our customer service.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Reliability", description: "Communicating clearly about confirmed services and expectations." },
              { icon: TrendingUp, title: "Improvement", description: "Working to make shipment enquiries and updates easier to understand." },
              { icon: Users, title: "Customer Focus", description: "Listening to customer needs and responding with practical information." },
              { icon: Award, title: "Care", description: "Treating shipment details and customer questions with care." },
              { icon: Globe, title: "Connectivity", description: "Helping customers explore appropriate transport and freight options." },
              { icon: Target, title: "Integrity", description: "Being transparent about pricing, service availability, and delivery estimates." },
            ].map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4"><value.icon className="h-6 w-6 text-orange-600" /></div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative h-96 rounded-2xl overflow-hidden">
              <NextImage src="/brand1.jpeg" alt="Logistics Operations" fill className="object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative h-96 rounded-2xl overflow-hidden">
              <NextImage src="/brand2.jpeg" alt="Warehouse Operations" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
