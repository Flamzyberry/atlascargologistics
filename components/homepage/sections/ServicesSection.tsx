"use client";

import { AnimatedSection, StaggerWrapper, fadeInUp } from "../motion";
import { ServiceCard } from "../ServiceCard";
import { motion } from "framer-motion";
import {
  Truck,
  Plane,
  Ship,
  Train,
  Warehouse,
  Globe,
  Zap
} from "lucide-react";

const services = [
  {
    title: "Domestic Shipping",
    description: "Shipping and delivery options for parcels and business shipments within the areas we serve. Contact us to confirm routes and estimated delivery times.",
    icon: Truck,
    image: "/images/service-domestic.jpg",
  },
  {
    title: "International Freight",
    description: "Support for international shipment enquiries, freight planning, and the documentation that may be required for cross-border transport.",
    icon: Globe,
    image: "/images/service-international.jpg",
  },
  {
    title: "Air Cargo",
    description: "Air-freight options for shipments where transit time matters. Availability, routing, and delivery estimates are confirmed when you request a quote.",
    icon: Plane,
    image: "/images/service-air.jpg",
  },
  {
    title: "Ocean Freight",
    description: "Sea-freight options for larger shipments. Contact us to discuss cargo details, route availability, and suitable shipping arrangements.",
    icon: Ship,
    image: "/images/service-ocean.jpg",
  },
  {
    title: "Rail Transport",
    description: "Rail freight enquiries for suitable routes and cargo types. Service availability depends on the origin, destination, and shipment requirements.",
    icon: Train,
    image: "/images/service-rail.jpg",
  },
  {
    title: "Warehousing & Fulfillment",
    description: "Ask us about storage, order handling, and fulfillment requirements. Available services and locations are confirmed on enquiry.",
    icon: Warehouse,
    image: "/images/service-warehouse.jpg",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Our Services
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
            Logistics Solutions for Your Shipments
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore shipping and freight options for your needs. Contact ShipX Cargo Logistics to confirm service availability, routes, and pricing.
          </p>
        </AnimatedSection>

        <StaggerWrapper className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeInUp}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                image={service.image}
              />
            </motion.div>
          ))}
        </StaggerWrapper>
      </div>
    </section>
  );
}
