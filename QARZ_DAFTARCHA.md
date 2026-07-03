# Qarz Daftarcha (Debt Ledger) - Foydalanish Qo'llanmasi

## 📋 Tavsif

Qarz Daftarcha - bu admin panel ichida joylashgan, kompaniyangizning kreditorlarini va qarzlarini kuzatib borish uchun mo'ljallangan tizim.

## ✨ Asosiy Xususiyatlar

### 1. **Qarz Qo'shish**
- Kreditor nomi (kompaniya yoki jismoniy shaxs)
- Telefon raqam
- Qarz summasi
- To'lash muddati
- Qo'shimcha tavsif

### 2. **To'lov Qo'shish**
- Qisman to'lovlarni qayd qilish
- To'lov sanasi va summasi
- To'lov haqida izoh yozish
- Avtomatik foiz hisoblash

### 3. **Status Kuzatuvi**
- 🔴 **To'lanmagan** - hali to'lov qilinmagan
- 🟡 **Qisman to'langan** - qarzning bir qismi to'langan
- 🟢 **To'liq to'langan** - qarz butunlay yopilgan

### 4. **Statistika Dashboard**
- Jami qarz summasi
- To'langan summa
- Qolgan qarz
- To'lov foizi

### 5. **To'lovlar Tarixi**
- Har bir qarz bo'yicha to'lovlar ro'yxati
- Sanalar va summalar
- Izohlar

### 6. **Vizual Ko'rsatkichlar**
- Progress bar - qancha foiz to'langanini ko'rsatadi
- Rangli statuslar
- Muddati o'tgan qarzlar uchun ogohlantirish

## 🚀 O'rnatish va Ishga Tushirish

### 1. Database Migratsiyasi

Qarz daftarcha uchun jadvallar allaqachon Prisma schemaga qo'shilgan. Migratsiya uchun:

```bash
# Prisma Client generatsiya qilish
npx prisma generate

# Database migratsiya
npx prisma migrate dev --name add_debt_tables

# Yoki ishlab turgan database uchun
npx prisma db push
```

### 2. Database Strukturasi

**Debts jadvali:**
- `id` - Unique ID
- `creditorName` - Kreditor nomi
- `creditorType` - COMPANY yoki PERSON
- `phone` - Telefon raqam
- `description` - Tavsif
- `totalAmount` - Jami qarz
- `paidAmount` - To'langan summa
- `status` - ACTIVE, PARTIAL, PAID
- `dueDate` - To'lash muddati
- `createdAt` / `updatedAt` - Sanalar

**DebtPayment jadvali:**
- `id` - Unique ID
- `debtId` - Qaysi qarzga tegishli
- `amount` - To'lov summasi
- `date` - To'lov sanasi
- `note` - Izoh
- `createdAt` - Yaratilgan sana

## 📍 API Endpointlar

### Barcha qarzlar
```
GET /api/debts
GET /api/debts?status=ACTIVE
GET /api/debts?status=PARTIAL
GET /api/debts?status=PAID
```

### Bitta qarz
```
GET /api/debts/[id]
```

### Yangi qarz qo'shish
```
POST /api/debts
Body: {
  creditorName: string,
  creditorType: "COMPANY" | "PERSON",
  phone?: string,
  description?: string,
  totalAmount: number,
  dueDate?: string (ISO date)
}
```

### Qarzni yangilash
```
PATCH /api/debts/[id]
Body: { ... }
```

### Qarzni o'chirish
```
DELETE /api/debts/[id]
```

### To'lov qo'shish
```
POST /api/debts/[id]/payments
Body: {
  amount: number,
  date?: string (ISO date),
  note?: string
}
```

## 💡 Foydalanish

### 1. Qarz Qo'shish
1. Admin panelda "Qarz daftarcha" bo'limiga o'ting
2. "Qarz qo'shish" tugmasini bosing
3. Formani to'ldiring:
   - Kreditor turi (Kompaniya/Shaxs)
   - Nomi
   - Telefon (ixtiyoriy)
   - Qarz summasi (majburiy)
   - To'lash muddati (ixtiyoriy)
   - Tavsif (ixtiyoriy)
4. "Saqlash" ni bosing

### 2. To'lov Qo'shish
1. Qarz kartochkasida "To'lov qo'shish" tugmasini bosing
2. To'lov summasini kiriting
3. Sanani tanlang (default bugungi kun)
4. Izoh qo'shing (ixtiyoriy)
5. "Saqlash" ni bosing

Sistema avtomatik ravishda:
- Qarz statusini yangilaydi
- Foizni qayta hisoblaydi
- Progress barni yangilaydi
- Agar qarz to'liq to'langan bo'lsa, status "PAID" ga o'zgaradi

### 3. Filtrlash
Dashboard tepasida filter tugmalari:
- **Hammasi** - barcha qarzlar
- **To'lanmagan** - faqat ochiq qarzlar
- **Qisman** - qisman to'langan qarzlar
- **To'liq** - yopilgan qarzlar

### 4. To'lovlar Tarixini Ko'rish
Qarz kartochkasida "To'lovlar tarixi" tugmasini bosing - barcha to'lovlar chronological tartibda ko'rsatiladi.

## 🎨 Dizayn Xususiyatlari

- Modern, qorong'i tema
- Responsive dizayn
- Animatsiyalar
- Rang kodlari:
  - 🔴 Qizil - to'lanmagan
  - 🟡 Sariq - qisman
  - 🟢 Yashil - to'langan
- Progress barlar
- Modal oynalar
- Toast bildirishnomalar

## ⚙️ Texnik Ma'lumotlar

**Stack:**
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- Zustand (state management - ixtiyoriy)
- React Hot Toast

**Fayl strukturasi:**
```
src/
├── app/
│   ├── api/
│   │   └── debts/
│   │       ├── route.ts           # GET, POST
│   │       └── [id]/
│   │           ├── route.ts       # GET, PATCH, DELETE
│   │           └── payments/
│   │               └── route.ts   # POST payment
│   └── admin/
│       └── debts/
│           └── page.tsx           # UI
└── prisma/
    └── schema.prisma              # DB schema
```

## 🔒 Xavfsizlik

- API routelar autentifikatsiya kerak (admin faqat)
- Input validatsiya
- SQL injection himoyasi (Prisma)
- XSS himoyasi

## 📊 Kelajakda Qo'shilishi Mumkin

- [ ] Excel/PDF export
- [ ] Avtomatik eslatmalar (email/SMS)
- [ ] Grafik va hisobotlar
- [ ] Valyuta konversiyasi
- [ ] To'lovni tahrirlash/o'chirish
- [ ] Qarzni bo'lib to'lash rejasi
- [ ] Qarz shartnomalari (PDF upload)

## 📞 Yordam

Savol yoki muammo bo'lsa:
- GitHub Issues
- Email: support@fmimetall.uz
- Telegram: @fmimetall

---

**Ishlab chiqildi:** F.M.I Metall Market Development Team  
**Versiya:** 1.0.0  
**Sana:** 2026-07-02
