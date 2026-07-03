"use client";

import Link from "next/link";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
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
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=450&fit=crop",
    author: "FMI Metall Market",
    date: "2026-06-20",
    tagsUz: ["Armatura", "Qurilish", "Maslahat"],
    tagsRu: ["Арматура", "Строительство", "Советы"],
    readTimeUz: "5 daqiqa",
    readTimeRu: "5 минут",
  },
  {
    id: "2",
    slug: "metall-narxlari-2026",
    titleUz: "2026-yil yozida metall narxlari — qanday o'zgaradi?",
    titleRu: "Цены на металл летом 2026 года — как изменятся?",
    excerptUz: "Joriy bozor tahlili: armatura, quvur va list temir narxlarining so'nggi o'zgarishlari va kelajak prognozi.",
    excerptRu: "Анализ рынка: последние изменения цен на арматуру, трубы и листовой металл.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=450&fit=crop",
    author: "FMI Metall Market",
    date: "2026-06-15",
    tagsUz: ["Narxlar", "Tahlil", "Bozor"],
    tagsRu: ["Цены", "Анализ", "Рынок"],
    readTimeUz: "7 daqiqa",
    readTimeRu: "7 минут",
  },
  {
    id: "3",
    slug: "quvur-turlari-farqi",
    titleUz: "Profil quvur va yumaloq quvur: qaysi birini tanlash kerak?",
    titleRu: "Профильная и круглая труба: что выбрать?",
    excerptUz: "Har xil turdagi quvurlarning afzalliklari va kamchiliklari haqida ma'lumot.",
    excerptRu: "Преимущества и недостатки разных типов труб.",
    image: "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=800&h=450&fit=crop",
    author: "FMI Metall Market",
    date: "2026-06-10",
    tagsUz: ["Quvur", "Taqqoslash"],
    tagsRu: ["Труба", "Сравнение"],
    readTimeUz: "4 daqiqa",
    readTimeRu: "4 минуты",
  },
  {
    id: "4",
    slug: "list-temir-qalinligi",
    titleUz: "List temir qalinligini qanday tanlash kerak?",
    titleRu: "Как выбрать толщину листового металла?",
    excerptUz: "Turli maqsadlar uchun mos list temir qalinligi: pol, devor, qopqoq.",
    excerptRu: "Подходящая толщина листового металла для разных целей.",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&h=450&fit=crop",
    author: "FMI Metall Market",
    date: "2026-06-05",
    tagsUz: ["List temir", "Maslahat"],
    tagsRu: ["Листовой металл", "Советы"],
    readTimeUz: "3 daqiqa",
    readTimeRu: "3 минуты",
  },
];

export default function BlogPage() {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  const getTitle   = (p: typeof posts[0]) => lang === "ru" ? p.titleRu   : p.titleUz;
  const getExcerpt = (p: typeof posts[0]) => lang === "ru" ? p.excerptRu : p.excerptUz;
  const getTags    = (p: typeof posts[0]) => lang === "ru" ? p.tagsRu    : p.tagsUz;
  const locale     = lang === "ru" ? "ru-RU" : "uz-UZ";

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">
          {t.blog.title} <span className="gold-text">{t.blog.titleHighlight}</span>
        </h1>
        <p className="text-text-secondary">{t.blog.subtitle}</p>
      </div>

      {/* Featured Post */}
      <Link href={`/blog/${posts[0].slug}`} className="card block overflow-hidden mb-8 group hover:border-accent-gold/30 transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posts[0].image} alt={getTitle(posts[0])} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {getTags(posts[0]).map((tag) => (
                <span key={tag} className="text-xs bg-accent-gold/10 text-accent-gold border border-accent-gold/20 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-gold transition-colors">{getTitle(posts[0])}</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-4">{getExcerpt(posts[0])}</p>
            <div className="flex items-center gap-4 text-text-muted text-xs">
              <span className="flex items-center gap-1"><User size={12} />{posts[0].author}</span>
              <span className="flex items-center gap-1"><Calendar size={12} />{new Date(posts[0].date).toLocaleDateString(locale, { day: "numeric", month: "long" })}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.slice(1).map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card overflow-hidden group hover:border-accent-gold/30 transition-all duration-300 hover:-translate-y-1">
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={getTitle(post)} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {getTags(post).map((tag) => (
                  <span key={tag} className="text-xs text-text-muted flex items-center gap-0.5"><Tag size={10} />{tag}</span>
                ))}
              </div>
              <h3 className="font-semibold text-text-primary text-sm leading-snug mb-2 group-hover:text-accent-gold transition-colors line-clamp-2">{getTitle(post)}</h3>
              <p className="text-text-muted text-xs leading-relaxed line-clamp-2 mb-3">{getExcerpt(post)}</p>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1"><Calendar size={11} />{new Date(post.date).toLocaleDateString(locale, { day: "numeric", month: "long" })}</span>
                <span className="flex items-center gap-1 text-accent-gold">{t.blog.readMore} <ArrowRight size={11} /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
