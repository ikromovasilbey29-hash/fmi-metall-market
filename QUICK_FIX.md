# ⚡ TEZKOR YECHIM - Qarz Qo'shish Ishlamayapti

## 🎯 Eng Tez Yechim (90% Ishlatadi)

### 1. Database'ni Yarating va Migration Qiling

```bash
cd fmi-metall-market

# 1. .env fayl borligini tekshiring
dir .env

# Agar yo'q bo'lsa:
copy .env.example .env

# 2. Prisma migration
npm run prisma:generate
npm run prisma:push

# 3. Serverni ishga tushiring
npm run dev
```

### 2. Agar Yuqoridagi Ishlamasa

**PostgreSQL database yarating:**

```bash
# PostgreSQL CLI ga kiring
psql -U postgres

# Database yarating
CREATE DATABASE fmi_metall_market;

# Chiqing
\q
```

Keyin yana:
```bash
npm run prisma:push
npm run dev
```

### 3. Browser'da Sinang

```
http://localhost:3000/admin/debts
```

---

## 🔍 Aynan Qanday Xato?

### Xato 1: "Cannot connect to database"
**Yechim:** PostgreSQL'ni ishga tushiring
- Windows: `services.msc` → PostgreSQL service → Start

### Xato 2: "Table does not exist"
**Yechim:** 
```bash
npm run prisma:push
```

### Xato 3: Modal ochiladi lekin saqlanganda xato
**Yechim:** Browser Console'ni tekshiring (F12 → Console)

### Xato 4: Hech narsa bo'lmaydi
**Yechim:** 
```bash
# Serverni restart qiling
# Ctrl+C
npm run dev
```

---

## 📞 Aniq Xato Xabarini Yuboring

Agar hali ham ishlamasa, quyidagilarni yuboring:

1. **Browser Console xatosi** (F12 → Console)
2. **Server terminal xatosi** (npm run dev ishlab turgan joy)
3. **Qanday hodisa?**
   - Modal ochilmayaptimi?
   - Modal ochilib saqlanganda xato?
   - Hech narsa bo'lmayaptimi?

---

## 🎬 Video Tutorial

Agar muammo davom etsa, screen recording yuboring:
1. "Qarz qo'shish" tugmasini bosish
2. Formani to'ldirish
3. "Saqlash" bosish
4. Nima bo'lishi

---

**Men yordam berishga tayyorman!** 😊
