# 🔍 Qarz Qo'shib Bo'lmayapti - Debug Qo'llanmasi

## 1️⃣ Database Ulanishini Tekshirish

### A. Prisma Studio'ni Oching
```bash
cd fmi-metall-market
npm run prisma:studio
```

✅ Agar ochilsa - database ulangan  
❌ Agar xato bersa - database ulanmagan

### B. Database'da Jadvallar Bormi?

Prisma Studio'da:
- `debts` jadvali ko'rinishi kerak
- `debt_payments` jadvali ko'rinishi kerak

❌ **Agar jadvallar yo'q bo'lsa:**
```bash
# Migration qiling
npm run prisma:generate
npm run prisma:migrate

# Yoki
npm run prisma:push
```

---

## 2️⃣ .env Faylini Tekshirish

### Faylni Oching:
```
fmi-metall-market/.env
```

### DATABASE_URL Bormi?
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fmi_metall_market"
```

❌ **Agar yo'q bo'lsa:**
```bash
copy .env.example .env
```

Keyin `.env` faylni tahrirlang va to'g'ri ma'lumotlarni kiriting.

---

## 3️⃣ Server Ishlab Turibmi?

### Terminal'ni Tekshiring:

✅ **Yaxshi:**
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

❌ **Xato:**
```
Error: Cannot connect to database
```

### Serverni Qayta Ishga Tushirish:
```bash
# Ctrl+C bosib to'xtating
npm run dev
```

---

## 4️⃣ Browser Console'ni Tekshirish

### Browser'da:
1. F12 bosing (Developer Tools)
2. "Console" tabga o'ting
3. "Qarz qo'shish" tugmasini bosing
4. Formani to'ldiring
5. "Saqlash" bosing

### Xatolarni Ko'ring:

✅ **Yaxshi:**
```
Form data: {creditorName: "...", totalAmount: 50000000, ...}
Sending to API: {...}
API response: {success: true, data: {...}}
```

❌ **Xato:**
```
POST /api/debts 500 (Internal Server Error)
Error: ...
```

---

## 5️⃣ Server Logs'ni Tekshirish

### Terminal'da (npm run dev ishlab turgan joyda):

✅ **Yaxshi:**
```
Received debt data: {...}
Debt created successfully: clx123456789
```

❌ **Xato:**
```
POST /api/debts error: PrismaClientKnownRequestError
  Invalid `prisma.debt.create()` invocation
  Table `debts` does not exist
```

---

## 🔧 Umumiy Muammolar va Yechimlar

### Muammo 1: "Table does not exist"

**Sabab:** Migration qilinmagan

**Yechim:**
```bash
npm run prisma:generate
npm run prisma:push
```

---

### Muammo 2: "Cannot connect to database"

**Sabab:** PostgreSQL ishlamayapti yoki .env xato

**Yechim:**

**Windows:**
1. Win+R bosing
2. `services.msc` yozing
3. PostgreSQL service'ni toping
4. Start bosing

**.env Tekshirish:**
```env
# To'g'ri format
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"

# Misol
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/fmi_metall_market"
```

---

### Muammo 3: "400 Bad Request"

**Sabab:** Form validation xatosi

**Yechim:** Console'da xatoni o'qing:
- "Kreditor nomini kiriting" → Nomni to'ldiring
- "Qarz summasini to'g'ri kiriting" → Summa > 0 bo'lishi kerak

---

### Muammo 4: Network Error / CORS

**Sabab:** Server ishlamayapti

**Yechim:**
```bash
# Serverni qayta ishga tushiring
npm run dev
```

---

## 📝 Step-by-Step Debug

### 1. Database Tekshirish
```bash
npm run prisma:studio
```
- ✅ Ochildi? → 2-qadamga o'ting
- ❌ Xato? → .env va PostgreSQL'ni tekshiring

### 2. Jadvallar Bormi?
- ✅ `debts` va `debt_payments` bor? → 3-qadamga
- ❌ Yo'q? → Migration qiling:
  ```bash
  npm run prisma:push
  ```

### 3. Server Ishga Tushirish
```bash
npm run dev
```
- ✅ "Ready" ko'rsatdi? → 4-qadamga
- ❌ Xato? → Terminal xatosini o'qing

### 4. Browser'da Sinash
1. http://localhost:3000/admin/debts ga o'ting
2. F12 bosing (Console ochiladi)
3. "Qarz qo'shish" ni bosing
4. Formani to'ldiring:
   - Kreditor nomi: "Test Company"
   - Summa: 1000000
5. "Saqlash" ni bosing

### 5. Console'ni Ko'ring
- ✅ "API response: {success: true}" → Muvaffaqiyatli!
- ❌ Xato? → Xato xabarini o'qing

---

## 🆘 Hali Ham Ishlamasa?

### Quyidagilarni yuboring:

1. **Browser Console screenshot** (F12 → Console)
2. **Server Terminal logs** (npm run dev ishlab turgan terminal)
3. **Prisma Studio screenshot** (jadvallar ko'rinishi)

### Yoki:

**Database'ni reset qiling (EHTIYOT!):**
```bash
npm run prisma:migrate reset
# Bu barcha ma'lumotlarni o'chiradi!
```

---

## ✅ Muvaffaqiyatli Bo'ldi!

Agar qarz muvaffaqiyatli qo'shilsa:
- ✅ Toast: "Qarz muvaffaqiyatli qo'shildi!"
- ✅ Modal yopiladi
- ✅ Yangi qarz ro'yxatda ko'rinadi
- ✅ Statistika yangilanadi

---

**Omad!** 🎉

Qo'shimcha yordam kerak bo'lsa, yuqoridagi ma'lumotlarni to'plang va murojaat qiling.
