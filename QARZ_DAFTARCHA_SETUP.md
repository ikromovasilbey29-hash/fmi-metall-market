# 🚀 Qarz Daftarcha - Tez Sozlash

## 1️⃣ Database Sozlash

### .env fayl yaratish
```bash
# .env.example dan nusxa oling
copy .env.example .env
```

### .env faylini to'ldiring:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fmi_metall_market"
```

## 2️⃣ Prisma Migratsiya

```bash
# 1. Prisma Client generatsiya
npm run prisma:generate

# 2. Database migratsiya (development)
npm run prisma:migrate

# YOKi production uchun (migratsiyasiz)
npm run prisma:push
```

## 3️⃣ Serverni Ishga Tushirish

```bash
npm run dev
```

Server: http://localhost:3000

## 4️⃣ Qarz Daftarchaga Kirish

1. Brauzerda ochish: http://localhost:3000/admin/debts
2. Admin hisobi bilan kirish kerak

## ✅ Tayyor!

Endi siz:
- Qarz qo'shishingiz
- To'lov qo'shishingiz
- Statistikani ko'rishingiz mumkin

## 🔍 Prisma Studio (ixtiyoriy)

Database'ni vizual ko'rish uchun:

```bash
npm run prisma:studio
```

Bu sizga http://localhost:5555 da database boshqaruv panelini ochadi.

## 📝 Test Ma'lumotlar

Agar test uchun ma'lumot kerak bo'lsa, Prisma Studio orqali yoki API orqali qo'shing:

**POST /api/debts:**
```json
{
  "creditorName": "O'zbekiston Temir-Beton",
  "creditorType": "COMPANY",
  "phone": "+998901234567",
  "description": "Armatura zakazi",
  "totalAmount": 50000000,
  "dueDate": "2026-12-31"
}
```

## ❓ Muammolar

### Database'ga ulanmadi?
- PostgreSQL ishlab turibdi?
- DATABASE_URL to'g'rimi?
- Port band emasmi?

### Prisma xatosi?
```bash
# Client'ni qayta generatsiya qiling
npm run prisma:generate
```

### API xatosi?
- Brauzer Console'ni tekshiring
- Server logs'ni ko'ring
- Network tab'ni tekshiring

## 📞 Yordam Kerakmi?

QARZ_DAFTARCHA.md faylini o'qing - u yerda to'liq qo'llanma bor.
