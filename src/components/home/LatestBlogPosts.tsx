"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";

const posts = [
  {
    id: "1",
    slug: "armatura-tanlash-qollanma",
    titleUz: "Qurilish uchun to'g'ri armatura qanday tanlanadi?",
    titleRu: "Как правильно выбрать арматуру для строительства?",
    excerptUz: "Qurilish loyihasida armatura tanlashda nimalarga e'tibor berish kerak — diametr, markasi va miqdori haqida batafsil ma'lumot.",
    excerptRu: "На что обращать внимание при выборе арматуры — диаметр, марка и количество.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop",
    date: "2026-06-20",
  },
  {
    id: "2",
    slug: "metall-narxlari-2026",
    titleUz: "2026-yil yozida metall narxlari — qanday o'zgaradi?",
    titleRu: "Цены на металл летом 2026 года — как изменятся?",
    excerptUz: "Joriy bozor tahlili: armatura, quvur va list temir narxlarining so'nggi o'zgarishlari.",
    excerptRu: "Анализ рынка: последние изменения цен на арматуру, трубы и листовой металл.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop",
    date: "2026-06-15",
  },
  {
    id: "3",
    slug: "quvur-turlari-farqi",
    titleUz: "Profil quvur va yumaloq quvur: qaysi birini tanlash kerak?",
    titleRu: "Профильная труба и круглая труба: что выбрать?",
    excerptUz: "Har xil turdagi quvurlarning afzalliklari va kamchiliklari haqida ma'lumot.",
    excerptRu: "Преимущества и недостатки разных типов труб, в каких случаях что подходит.",
    image: "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=400&h=250&fit=crop",
    date: "2026-06-10",
  },
];

export default function LatestBlogPosts() {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">
            {t.blog.latestTitle} <span className="gold-text">{t.blog.latestHighlight}</span>
          </h2>
          <p className="text-text-muted text-sm mt-1">{t.blog.subtitle}</p>
        </div>
        <Link href="/blog" className="flex items-center gap-1.5 text-accent-gold hover:text-accent-gold-hover text-sm font-medium transition-colors">
          {t.home.viewAll} <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card group overflow-hidden hover:border-accent-gold/30 transition-all duration-300">
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={lang === "ru" ? post.titleRu : post.titleUz} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-text-muted text-xs mb-3">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h3 className="font-semibold text-text-primary text-sm leading-snug mb-2 group-hover:text-accent-gold transition-colors line-clamp-2">
                {lang === "ru" ? post.titleRu : post.titleUz}
              </h3>
              <p className="text-text-muted text-xs leading-relaxed line-clamp-3">
                {lang === "ru" ? post.excerptRu : post.excerptUz}
              </p>
              <div className="flex items-center gap-1 mt-3 text-accent-gold text-xs font-medium">
                {t.blog.readMore} <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
