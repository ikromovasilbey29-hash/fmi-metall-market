"use client";

import Link from "next/link";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";

const posts: Record<string, {
  titleUz: string; titleRu: string;
  excerptUz: string; excerptRu: string;
  contentUz: string; contentRu: string;
  image: string; author: string; date: string;
  tagsUz: string[]; tagsRu: string[];
}> = {
  "armatura-tanlash-qollanma": {
    titleUz: "Qurilish uchun to'g'ri armatura qanday tanlanadi?",
    titleRu: "Как правильно выбрать арматуру для строительства?",
    excerptUz: "Qurilish loyihasida armatura tanlashda nimalarga e'tibor berish kerak.",
    excerptRu: "На что обращать внимание при выборе арматуры для строительного проекта.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
    author: "FMI Metall Market", date: "2026-06-20",
    tagsUz: ["Armatura", "Qurilish", "Maslahat"],
    tagsRu: ["Арматура", "Строительство", "Советы"],
    contentUz: `## Armatura nima?\n\nArmatura — temir-beton konstruktsiyalarida ishlatiluvchi po'lat sterjenlar. Ular beton bilan birgalikda yuklarga chidamlilikni oshiradi.\n\n## Diametrni qanday tanlash kerak?\n\n- Uy poydevori uchun: D12–D16 (A400 yoki A500)\n- Pol to'shama uchun: D8–D10\n- Devor konstruktsiyalari uchun: D6–D8\n\n## A-markasi nima?\n\n- **A240** — tekis sirt, yuqori elastiklik\n- **A400** — yirik qurilishda standart\n- **A500** — og'ir yuklar uchun\n\n## Xulosa\n\nTo'g'ri armatura tanlash qurilmangizning uzoq muddatli xizmat qilishini ta'minlaydi.`,
    contentRu: `## Что такое арматура?\n\nАрматура — стальные стержни, используемые в железобетонных конструкциях. В сочетании с бетоном они повышают устойчивость к нагрузкам.\n\n## Как выбрать диаметр?\n\n- Для фундамента дома: D12–D16 (марка A400 или A500)\n- Для напольной стяжки: D8–D10\n- Для стеновых конструкций: D6–D8\n\n## Что такое марка А?\n\n- **A240** — гладкая поверхность, высокая эластичность\n- **A400** — стандарт для крупного строительства\n- **A500** — для тяжёлых нагрузок\n\n## Итог\n\nПравильный выбор арматуры обеспечит долгий срок службы вашей конструкции.`,
  },
  "metall-narxlari-2026": {
    titleUz: "2026-yil yozida metall narxlari",
    titleRu: "Цены на металл летом 2026 года",
    excerptUz: "Joriy bozor tahlili: armatura, quvur va list temir narxlari.",
    excerptRu: "Анализ рынка: цены на арматуру, трубы и листовой металл.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
    author: "FMI Metall Market", date: "2026-06-15",
    tagsUz: ["Narxlar", "Tahlil"],
    tagsRu: ["Цены", "Анализ"],
    contentUz: `## 2026-yil yozida narxlar holati\n\nMetall narxlari hozirda barqaror. Asosiy omillar:\n\n- **Xomashyo narxi:** Global bozorda po'lat nisbatan barqaror\n- **Dollar kursi:** Narxlarga ta'sir qiluvchi asosiy omil\n- **Qurilish talabi:** Yozgi mavsumiday talabning ortishi kuzatilmoqda\n\n## Joriy taxminiy narxlar (1 kg)\n\n- Armatura D10-D16: 8,000 – 9,000 so'm\n- List temir 2–6mm: 11,000 – 14,000 so'm\n- Profil quvur: 9,000 – 11,000 so'm`,
    contentRu: `## Ситуация с ценами летом 2026\n\nЦены на металл сейчас относительно стабильны. Основные факторы:\n\n- **Цена сырья:** На мировом рынке сталь относительно стабильна\n- **Курс доллара:** Основной фактор влияния на цены\n- **Строительный спрос:** Наблюдается рост спроса в летний сезон\n\n## Примерные текущие цены (за 1 кг)\n\n- Арматура D10-D16: 8 000 – 9 000 сум\n- Листовой металл 2–6мм: 11 000 – 14 000 сум\n- Профильная труба: 9 000 – 11 000 сум`,
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const post = posts[params.slug];

  if (!post) {
    return (
      <div className="container-main py-16 text-center">
        <p className="text-text-secondary text-xl mb-4">{t.blog.empty}</p>
        <Link href="/blog" className="btn-primary inline-block">{t.blog.backToBlog}</Link>
      </div>
    );
  }

  const title   = lang === "ru" ? post.titleRu   : post.titleUz;
  const content = lang === "ru" ? post.contentRu : post.contentUz;
  const tags    = lang === "ru" ? post.tagsRu    : post.tagsUz;
  const locale  = lang === "ru" ? "ru-RU" : "uz-UZ";

  return (
    <div className="container-main py-8 max-w-4xl">
      <Link href="/blog" className="flex items-center gap-2 text-text-muted hover:text-accent-gold text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        {t.blog.backToBlog}
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="text-xs bg-accent-gold/10 text-accent-gold border border-accent-gold/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag size={10} />{tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-black text-text-primary mb-4 leading-tight">{title}</h1>
        <div className="flex items-center gap-5 text-text-muted text-sm">
          <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.image} alt={title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8 border border-border" />

      <div className="card p-8">
        <div className="text-text-secondary leading-relaxed text-sm md:text-base">
          {content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-text-primary mt-6 mb-3">{line.replace("## ", "")}</h2>;
            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-text-primary my-2">{line.replace(/\*\*/g, "")}</p>;
            if (line.startsWith("- ")) return <li key={i} className="ml-4 my-1 text-text-secondary">{line.replace("- ", "")}</li>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="my-2 text-text-secondary">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
