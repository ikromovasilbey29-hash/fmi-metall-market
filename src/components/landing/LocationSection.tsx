"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function LocationSection() {
  const t = useT();
  const loc = t.landing.location;

  const contactInfo = [
    { icon: MapPin, label: loc.addressLabel, value: loc.addressValue, color: "text-red-400", bg: "bg-red-400/10" },
    { icon: Phone, label: loc.phoneLabel, value: "+998 91 234 56 78\n+998 93 456 78 90", color: "text-green-400", bg: "bg-green-400/10" },
    { icon: Mail, label: loc.emailLabel, value: "info@fmimetall.uz", color: "text-blue-400", bg: "bg-blue-400/10" },
    { icon: Clock, label: loc.workHoursLabel, value: loc.workHoursValue, color: "text-accent-gold", bg: "bg-accent-gold/10" },
  ];

  return (
    <section id="location" className="py-20 bg-bg-primary">
      <div className="container-main">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">
            {loc.title} <span className="gold-text">{loc.titleHighlight}</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            {loc.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="card p-5">
                  <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <p className="text-text-muted text-xs mb-1">{item.label}</p>
                  <p className="text-text-primary text-sm font-medium whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              );
            })}

            {/* Social Links */}
            <div className="card p-5 sm:col-span-2">
              <p className="text-text-muted text-xs mb-3">{loc.socialLabel}</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { name: "Telegram", href: "https://t.me/fmimetall", color: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30" },
                  { name: "Instagram", href: "https://instagram.com/fmimetall", color: "bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${social.color}`}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="rounded-xl overflow-hidden border border-border min-h-72 bg-bg-card flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent)]" />
            <MapPin size={48} className="text-accent-gold mb-4 opacity-60" />
            <p className="text-text-secondary text-sm mb-2">{loc.mapTitle}</p>
            <p className="text-text-muted text-xs text-center px-8">
              {loc.mapDesc}
            </p>
            <a
              href="https://maps.google.com/?q=Gijduvon,Bukhara,Uzbekistan"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 btn-secondary text-sm"
            >
              {loc.mapLink}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
