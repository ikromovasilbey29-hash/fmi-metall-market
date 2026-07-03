"use client";

import { useT } from "@/hooks/useT";

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&h=400&fit=crop",
];

export default function GallerySection() {
  const t = useT();
  const images = t.landing.gallery.images.map((img, i) => ({
    ...img,
    src: IMAGE_URLS[i],
  }));

  return (
    <section id="gallery" className="py-20 bg-bg-secondary">
      <div className="container-main">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">
            {t.landing.gallery.title} <span className="gold-text">{t.landing.gallery.titleHighlight}</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            {t.landing.gallery.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border hover:border-accent-gold/30 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-text-primary font-semibold text-sm">{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
