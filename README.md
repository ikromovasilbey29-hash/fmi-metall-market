# F.M.I Metall Market

**Texnologiyalar:** Next.js 14 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Zustand · Recharts

---

## 🚀 Ishga tushirish

### 1. Node.js o'rnatish
[nodejs.org](https://nodejs.org) dan LTS versiyasini yuklab o'rnating.

### 2. Loyiha papkasiga kiring
```bash
cd fmi-metall-market
```

### 3. Paketlarni o'rnatish
```bash
npm install
```

### 4. `.env` faylini yarating
```bash
copy .env.example .env
```
Keyin `.env` faylini to'ldiring (DATABASE_URL, NEXTAUTH_SECRET va boshqalar).

### 5. Ma'lumotlar bazasini sozlash (ixtiyoriy)
PostgreSQL o'rnatilgan bo'lsa:
```bash
npx prisma db push
npx prisma generate
```

### 6. Ishga tushirish
```bash
npm run dev
```

Sayt: [http://localhost:3000](http://localhost:3000)

---

## 📁 Loyiha tuzilishi

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── (main)/               # Asosiy sahifalar (navbar bilan)
│   │   ├── home/             # Bosh sahifa
│   │   ├── catalog/          # Katalog
│   │   ├── product/[slug]/   # Mahsulot sahifasi
│   │   ├── compare/          # Taqqoslash
│   │   ├── calculator/       # Kalkulyator
│   │   ├── cart/             # Savatcha
│   │   ├── checkout/         # Buyurtma
│   │   ├── blog/             # Blog
│   │   ├── profile/          # Profil
│   │   └── notifications/    # Bildirishnomalar
│   ├── admin/                # Admin panel
│   │   ├── dashboard/        # Statistika
│   │   ├── products/         # Mahsulotlar boshqaruvi
│   │   ├── orders/           # Buyurtmalar boshqaruvi
│   │   ├── finance/          # Kirim/Chiqim
│   │   └── debts/            # Qarz daftarcha
│   └── api/                  # API Route'lar
├── components/               # Komponentlar
├── store/                    # Zustand state management
├── lib/                      # Utility funksiyalar
└── types/                    # TypeScript tiplari
```

---

## 🌐 Sahifalar

| URL | Tavsifi |
|-----|---------|
| `/` | Landing page (mehmonlar uchun) |
| `/home` | Bosh sahifa (tizimga kirgandan so'ng) |
| `/catalog` | Mahsulotlar katalogi |
| `/product/[slug]` | Mahsulot tafsilotlari |
| `/compare` | Mahsulotlarni taqqoslash |
| `/calculator` | Og'irlik/narx kalkulyatori |
| `/cart` | Savatcha |
| `/checkout` | Buyurtma berish |
| `/blog` | Blog maqolalari |
| `/profile` | Foydalanuvchi profili |
| `/admin/dashboard` | Admin panel |
| `/admin/finance` | Moliyaviy boshqaruv |
| `/admin/debts` | Qarz daftarcha |

---

## 🎨 Dizayn

- **Fon:** `#0A0A0A` — `#1F1F1F`
- **Aksent:** `#D4AF37` (oltin)
- **Matn:** `#F5F5F5` — `#B0B0B0`
- **Shrift:** Inter / Montserrat

---

## 📦 Keyingi bosqichlar

1. ✅ Node.js va npm o'rnatish
2. ✅ `npm install` bajarish
3. 🔲 PostgreSQL ulash va `.env` to'ldirish
4. 🔲 `npx prisma db push` — DB sxemasini yaratish
5. 🔲 Cloudinary ulash (rasm yuklash uchun)
6. 🔲 Vercel ga deploy qilish

---

*F.M.I Metall Market © 2026 | Buxoro viloyati, G'ijduvon tumani*
