"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Domestic Shipping", href: "/services/domestic" },
    { name: "International Freight", href: "/services/international" },
    { name: "Air Cargo", href: "/services/air" },
    { name: "Ocean Freight", href: "/services/ocean" },
    { name: "Warehousing", href: "/services/warehousing" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "News & Updates", href: "/news" },
    { name: "Partners", href: "/partners" },
    { name: "Sustainability", href: "/sustainability" },
  ],
  support: [
    { name: "Track Shipment", href: "/track" },
    { name: "Get a Quote", href: "/quote" },
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
  ],
};

interface CompanySettings {
  companyName: string;
  officeAddress: string;
  phone: string;
  email: string;
  website?: string;
}

export function FooterSection() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "ShipX Cargo Logistics";

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch((error) => console.error("Failed to fetch settings:", error));
  }, []);

  return (
    <footer id="contact" className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold text-lg" aria-label={`${companyName} brand mark`}>
                SX
              </div>
              <span className="text-xl font-bold">{companyName}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Shipping and logistics enquiries, with service options confirmed based on your shipment requirements.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail className="h-4 w-4" />
                  {settings.email}
                </a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  {settings.phone}
                </a>
              )}
              {settings?.officeAddress && (
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{settings.officeAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-gray-300 text-sm">
                Newsletter subscriptions are not available yet. Please use our Contact Us page for updates and enquiries.
              </p>
              <Link href="/contact" className="inline-block mt-3 text-orange-400 hover:text-orange-300 text-sm font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>

            {/* Social links are hidden until official ShipX profile URLs are configured. */}
          </div>
        </div>
      </div>
    </footer>
  );
}
