# 📦 Database Migration Instructions

## Qarz Daftarcha uchun Database Jadvallarini Yaratish

### Option 1: Migration (Development - Tavsiya etiladi)

Bu usul migration history'ni saqlaydi va versiya boshqaruvini ta'minlaydi.

```bash
# 1. Migration yaratish
npx prisma migrate dev --name add_debt_tables

# Bu quyidagilarni bajaradi:
# - Prisma Client'ni generate qiladi
# - Migration faylini yaratadi (prisma/migrations/)
# - Database'ga jadvallarni qo'shadi
# - Migration history'ni saqlaydi
```

### Option 2: Push (Production yoki Tez Test)

Bu usul migration fayllarini yaratmaydi, to'g'ridan-to'g'ri schema'ni database'ga push qiladi.

```bash
npx prisma db push
```

⚠️ **Ogohlantirish:** Bu usul migration history'siz ishlaydi. Production'da ehtiyotkorlik bilan foydalaning.

## Migration Muvaffaqiyatli O'tdimi?

Migration'dan keyin quyidagilarni tekshiring:

```bash
# Database'ni Prisma Studio orqali ko'ring
npx prisma studio
```

Yoki SQL orqali:

```sql
-- PostgreSQL da
\dt

-- Debts va debt_payments jadvallari ko'rinishi kerak
```

## Agar Xato Bo'lsa?

### Migration Failed?

```bash
# Migration holatini tekshirish
npx prisma migrate status

# Migration'ni reset qilish (EHTIYOT: ma'lumotlar o'chadi!)
npx prisma migrate reset

# Qaytadan urinish
npx prisma migrate dev --name add_debt_tables
```

### Database Connection Error?

1. PostgreSQL ishlayotganini tekshiring:
   ```bash
   # Windows
   services.msc
   # PostgreSQL servisi Running holatida bo'lishi kerak
   ```

2. `.env` faylda DATABASE_URL'ni tekshiring:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

3. Database mavjudligini tekshiring:
   ```bash
   # PostgreSQL CLI
   psql -U postgres
   \l  # Databaselar ro'yxati
   \c fmi_metall_market  # Database'ga ulanish
   ```

### "Table already exists" xatosi?

Agar jadvallar allaqachon mavjud bo'lsa:

```bash
# Mavjud database holatini baseline sifatida belgilash
npx prisma migrate resolve --applied "add_debt_tables"
```

## Jadvallar Strukturasi

Migration'dan keyin quyidagi jadvallar yaratiladi:

### `debts` jadvali
- id (Primary Key)
- creditorName
- creditorType (COMPANY/PERSON)
- phone
- description
- totalAmount
- paidAmount
- status (ACTIVE/PARTIAL/PAID)
- dueDate
- createdAt
- updatedAt

### `debt_payments` jadvali
- id (Primary Key)
- debtId (Foreign Key -> debts.id)
- amount
- date
- note
- createdAt

## Keying Qadamlar

Migration muvaffaqiyatli o'tgandan keyin:

1. ✅ Serverni ishga tushiring: `npm run dev`
2. ✅ Admin panelga kiring: http://localhost:3000/admin/debts
3. ✅ Qarz qo'shib ko'ring
4. ✅ To'lov qo'shib ko'ring

## Ma'lumotlarni Backup

Migration'dan oldin ma'lumotlaringizni backup qiling:

```bash
# PostgreSQL backup
pg_dump -U postgres fmi_metall_market > backup.sql

# Restore
psql -U postgres fmi_metall_market < backup.sql
```

## Production'ga Deploy

Production'da migration qilish:

```bash
# 1. Backup oling!
# 2. Migration'ni qo'llang
npx prisma migrate deploy

# Bu faqat pending migration'larni qo'llaydi
# Development migration'larini ishlatmaydi
```

---

**Muhim Eslatma:** Production database'da migration qilishdan oldin:
1. ✅ Backup oling
2. ✅ Maintenance window belgilang
3. ✅ Test environment'da sinab ko'ring
4. ✅ Rollback rejasini tayyorlang
