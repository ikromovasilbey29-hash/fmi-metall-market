# 🎬 Qarz Daftarcha - Demo Walkthrough

## 📍 Kirish

**URL:** `http://localhost:3000/admin/debts`

---

## 1️⃣ Dashboard Ko'rinishi

Sahifani ochganingizda ko'rasiz:

### 📊 Statistika Kartalari (3 ta)
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 💳 Jami qarz        │  │ ✅ To'langan        │  │ ⚠️ Qolgan qarz      │
│ 50,000,000 so'm     │  │ 20,000,000 so'm     │  │ 30,000,000 so'm     │
│ 2 ta kreditor       │  │ 40% to'langan       │  │ 1 ta to'lanmagan    │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### 🔍 Filter Tugmalari
```
[Hammasi] [To'lanmagan] [Qisman] [To'liq]
                                    2 ta yozuv
```

### 📝 Qarzlar Ro'yxati
Har bir qarz kartochkasida:
- 🏢 Kreditor avatar (kompaniya yoki shaxs)
- 📝 Nomi, telefon, tavsif
- 📅 Muddat (agar belgilangan bo'lsa)
- 🎨 Status badge (Rangli)
- 📊 Progress bar (foiz bilan)
- 💰 Jami/To'langan/Qolgan summalar
- 🔘 To'lov qo'shish tugmasi
- 📜 To'lovlar tarixi tugmasi
- 🗑️ O'chirish tugmasi

---

## 2️⃣ Qarz Qo'shish

### Jarayon:

**1. "Qarz qo'shish" tugmasini bosing** (yuqori o'ng burchak)

**2. Modal oynasi ochiladi:**

```
┌─────────────────────────────────────┐
│  ➕ Qarz qo'shish              ✕   │
├─────────────────────────────────────┤
│                                     │
│  Kreditor turi:                     │
│  [Kompaniya ▼] [Kompaniya yoki ism]│
│                                     │
│  [+998901234567] [2026-12-31]      │
│                                     │
│  Qarz summasi (so'm) *              │
│  [50000000]                         │
│                                     │
│  Qarz haqida qo'shimcha ma'lumot    │
│  [Armatura zakazi uchun...]        │
│                                     │
│  [Bekor qilish]  [💾 Saqlash]      │
└─────────────────────────────────────┘
```

**3. Formani to'ldiring:**
- ✅ Kreditor turi: Kompaniya yoki Jismoniy shaxs
- ✅ Nomi: "O'zbekiston Temir-Beton"
- ☑️ Telefon: "+998901234567" (ixtiyoriy)
- ✅ Summa: 50,000,000
- ☑️ Muddat: "2026-12-31" (ixtiyoriy)
- ☑️ Tavsif: "Armatura zakazi uchun" (ixtiyoriy)

**4. "Saqlash" ni bosing**

**5. Toast bildirish:** ✅ "Qarz qo'shildi"

**6. Yangi qarz ro'yxatda paydo bo'ladi**

---

## 3️⃣ To'lov Qo'shish

### Jarayon:

**1. Qarz kartochkasida "To'lov qo'shish" tugmasini bosing**

**2. To'lov modali ochiladi:**

```
┌─────────────────────────────────────┐
│  💳 To'lov qo'shish            ✕   │
├─────────────────────────────────────┤
│  🏢 O'zbekiston Temir-Beton        │
│     Qolgan qarz: 50,000,000 so'm   │
├─────────────────────────────────────┤
│                                     │
│  To'lov summasi *    To'lov sanasi │
│  [10000000]          [2026-07-02]  │
│  Maksimal: 50,000,000 so'm          │
│                                     │
│  To'lov haqida izoh                 │
│  [Dastlabki to'lov]                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ To'lovdan keyin:            │   │
│  │ To'langan: 10,000,000       │   │
│  │ Qolgan: 40,000,000          │   │
│  │ Foiz: 20%                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Bekor qilish]  [💾 Saqlash]      │
└─────────────────────────────────────┘
```

**3. To'lov ma'lumotlarini kiriting:**
- ✅ Summa: 10,000,000
- ✅ Sana: Bugungi kun (default)
- ☑️ Izoh: "Dastlabki to'lov"

**4. Hisoblash avtomatik ko'rsatiladi:**
- To'langan: 10,000,000
- Qolgan: 40,000,000
- Foiz: 20%

**5. "Saqlash" ni bosing**

**6. Toast bildirish:** ✅ "To'lov qo'shildi!"

**7. Qarz kartochkasi yangilanadi:**
- 🎨 Status: "To'lanmagan" → "Qisman to'langan" (sariq)
- 📊 Progress bar: 0% → 20% (sariq rangli)
- 💰 Summalar yangilandi

---

## 4️⃣ To'lovlar Tarixini Ko'rish

### Jarayon:

**1. "To'lovlar tarixi (1)" tugmasini bosing**

**2. Kartochka kengayadi:**

```
┌────────────────────────────────────────┐
│ TO'LOVLAR TARIXI                       │
├────────────────────────────────────────┤
│  ① +10,000,000 so'm     2-Iyul, 2026   │
│     Dastlabki to'lov                   │
└────────────────────────────────────────┘
```

**3. Har bir to'lov ko'rsatiladi:**
- Raqam
- Summa (yashil rangda)
- Sana
- Izoh

---

## 5️⃣ Filtrlash

### Filter tugmalaridan birini bosing:

**"To'lanmagan":**
- Faqat status=ACTIVE qarzlar ko'rsatiladi

**"Qisman":**
- Faqat status=PARTIAL qarzlar ko'rsatiladi

**"To'liq":**
- Faqat status=PAID qarzlar ko'rsatiladi (opacity past)

**"Hammasi":**
- Barcha qarzlar ko'rsatiladi

---

## 6️⃣ Qarzni To'liq To'lash

### Jarayon:

**1. Yana to'lov qo'shing:**
- Summa: 40,000,000 (qolgan summa)

**2. Saqlangandan keyin:**
- 🎨 Status → "To'liq to'langan" (yashil)
- 📊 Progress bar → 100% (yashil)
- ✅ "To'lov qo'shish" tugmasi yo'qoladi
- 👁️ Kartochka opacity pastroq (70%)

---

## 7️⃣ Qarzni O'chirish

### Jarayon:

**1. Qarz kartochkasida 🗑️ tugmasini bosing**

**2. Tasdiq dialog:**
```
"O'zbekiston Temir-Beton" qarzini o'chirishni tasdiqlaysizmi?
[Bekor qilish]  [OK]
```

**3. "OK" bosing**

**4. Toast:** ✅ "Qarz o'chirildi"

**5. Qarz ro'yxatdan o'chadi**

---

## 8️⃣ Muddati O'tgan Qarz

Agar qarzning `dueDate` o'tgan bo'lsa:

```
┌─────────────────────────────────────┐
│ 🏢 O'zbekiston Temir-Beton         │
│    📞 +998901234567                │
│    · Muddat: 15-Iyn, 2026 ⚠ Muddati o'tgan │
└─────────────────────────────────────┘
```

- ⚠️ Ogohlantirish icon
- 🔴 Qizil rangda ko'rsatiladi

---

## 🎨 Dizayn Elementi

### Ranglar:
- **To'lanmagan:** 🔴 Qizil (bg-red-500/10)
- **Qisman:** 🟡 Sariq (bg-yellow-500/10)
- **To'liq:** 🟢 Yashil (bg-green-500/10)

### Progress Bar:
```
0% ────────────────── 100%
    ███░░░░░░░░░░░     (20%)
```

### Avatarlar:
- 🏢 Kompaniya: Ko'k rangda
- 👤 Shaxs: Binafsha rangda

---

## 📱 Responsive

Mobil qurilmalarda:
- Statistika kartalar ustma-ust
- Filterlar o'raladi
- Modal to'liq ekranni egallaydi
- Touch-friendly tugmalar

---

## 🎯 Asosiy Xususiyatlar

✅ Real-time yangilanish  
✅ Avtomatik hisoblash  
✅ Vizual feedback  
✅ Loading states  
✅ Error handling  
✅ Toast notifications  
✅ Responsive design  
✅ Accessibility (keyboard navigation)  

---

## 🧪 Test Scenariylari

### Scenario 1: Yangi qarz
1. ✅ Qarz qo'shish
2. ✅ Status "To'lanmagan"
3. ✅ Progress bar 0%

### Scenario 2: Qisman to'lov
1. ✅ To'lov qo'shish (50%)
2. ✅ Status → "Qisman"
3. ✅ Progress bar → 50%

### Scenario 3: To'liq to'lov
1. ✅ Qolgan summani to'lash
2. ✅ Status → "To'liq"
3. ✅ Progress bar → 100%
4. ✅ "To'lov qo'shish" yo'qoladi

### Scenario 4: Filtrlash
1. ✅ Har bir filter ishlaydi
2. ✅ Counter to'g'ri
3. ✅ URL query parameter (ixtiyoriy)

---

**Demo tugadi!** 🎉

Endi o'zingiz sinab ko'ring!
