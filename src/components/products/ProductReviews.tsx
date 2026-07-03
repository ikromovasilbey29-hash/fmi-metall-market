"use client";

import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Product } from "@/types";
import { useT } from "@/hooks/useT";

const REVIEWER_NAMES = [
  "Ruxsora", "Gulruh", "Sanjar", "Alisher", "Kamola", "Sherzod",
  "Dilnoza", "Jasur", "Nodira", "Bekzod", "Malika", "Ozodbek",
  "Zarina", "Farrux", "Shahnoza", "Otabek",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  purchaseInfo: string;
  pros: string;
  cons: string;
  comment: string;
}

function generateReviews(product: Product, t: ReturnType<typeof useT>): Review[] {
  const seed = hashString(product.id + product.slug);
  const rand = seededRandom(seed);
  const count = 3 + Math.floor(rand() * 3); // 3-5 ta sharh
  const months = t.product.reviewsMonths;

  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const nameIdx = Math.floor(rand() * REVIEWER_NAMES.length);
    const rating = rand() > 0.75 ? 4 : 5;
    const day = 1 + Math.floor(rand() * 28);
    const monthIdx = Math.floor(rand() * months.length);
    const qty = 1 + Math.floor(rand() * 10);

    reviews.push({
      id: `${product.id}-r${i}`,
      name: REVIEWER_NAMES[(nameIdx + i) % REVIEWER_NAMES.length],
      date: `${day}-${months[monthIdx]}, 2026`,
      rating,
      purchaseInfo: `${qty} ${product.unit} ${t.product.reviewsPurchased}`,
      pros: t.product.reviewsProsPool[Math.floor(rand() * t.product.reviewsProsPool.length)],
      cons: t.product.reviewsConsPool[Math.floor(rand() * t.product.reviewsConsPool.length)],
      comment: t.product.reviewsCommentPool[Math.floor(rand() * t.product.reviewsCommentPool.length)],
    });
  }

  return reviews;
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-accent-gold text-accent-gold" : "text-border-light"}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ product }: { product: Product }) {
  const t = useT();
  const reviews = generateReviews(product, t);
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-black text-text-primary mb-6">
        {t.product.reviewsTitle} <span className="gold-text">{t.product.reviewsHighlight}</span>
      </h2>

      {/* Umumiy baho */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl font-black text-text-primary">{avgRating.toFixed(1)}</span>
        <div>
          <StarRow rating={Math.round(avgRating)} size={18} />
          <p className="text-text-muted text-sm mt-1">{reviews.length} {t.product.reviewsCount}</p>
        </div>
      </div>

      {/* Sharhlar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="card p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-gold/15 text-accent-gold font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {r.name[0]}
                </div>
                <span className="font-semibold text-text-primary text-sm">{r.name}</span>
              </div>
              <span className="text-text-muted text-xs whitespace-nowrap">{r.date}</span>
            </div>

            <StarRow rating={r.rating} />
            <p className="text-text-muted text-xs">{r.purchaseInfo}</p>

            <div className="text-sm space-y-1 mt-1">
              <p className="text-text-secondary">
                <ThumbsUp size={12} className="inline mr-1 text-green-400" />
                <span className="text-text-muted">{t.product.reviewsPros}: </span>
                {r.pros}
              </p>
              <p className="text-text-secondary">
                <ThumbsDown size={12} className="inline mr-1 text-red-400" />
                <span className="text-text-muted">{t.product.reviewsCons}: </span>
                {r.cons}
              </p>
            </div>

            <p className="text-text-primary text-sm mt-1 pt-2 border-t border-border">
              <span className="text-text-muted">{t.product.reviewsComment}: </span>
              {r.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
