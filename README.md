# YASHIL BOWL — Node.js Restaurant Platform

Toshkentdagi zamonaviy healthy-food restorani uchun ishlab chiqilgan to‘liq ishlaydigan buyurtma platformasi. Loyiha MCWeb kabi oddiy Node.js hostinglarda ishlashi uchun Cloudflare D1’dan mahalliy SQLite bazasiga moslashtirilgan.

## Imkoniyatlar

- 20 ta tayyor bowl, salat va ichimlik
- O‘zbek, rus va ingliz tillari
- Responsive bosh sahifa va qidiruvli menyu
- Savat, promo-kod va yetkazib berish hududlari
- Naqd yoki CHECKOUT.UZ orqali onlayn to‘lov
- Buyurtmani ID yoki telefon orqali kuzatish
- `/admin` orqali himoyalangan boshqaruv paneli
- Taomlar, buyurtmalar, mijozlar, promo-kodlar va sozlamalar boshqaruvi
- Mahalliy SQLite baza — alohida MySQL server talab qilmaydi

## Mahalliy ishga tushirish

```bash
npm install
cp .env.example .env.local
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

## MCWeb sozlamalari

- Application type: `Web Service`
- Runtime: `Node.js 22`
- Repository branch: `main`
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Port: MCWeb bergan `PORT` environment variable orqali avtomatik olinadi

Environment variables:

```env
DB_PATH=storage/yashil.sqlite
YASHIL_ADMIN_LOGIN=admin
YASHIL_ADMIN_PASSWORD=
YASHIL_ADMIN_SESSION_SECRET=
YASHIL_SETTINGS_ENCRYPTION_SECRET=
YASHIL_CHECKOUT_WEBHOOK_SECRET=
```

Haqiqiy qiymatlarni GitHub’ga yozmang. Ularni faqat MCWeb loyiha sozlamalaridagi environment variables bo‘limiga kiriting.

## Muhim papkalar

```text
app/                Next.js sahifalar va API
db/local.ts         SQLite adapter va avtomatik schema
public/             logo, rasmlar va to‘lov tizimi logotiplari
storage/            runtime SQLite bazasi (Git’ga yuklanmaydi)
```

## Brend

Nomi: **YASHIL BOWL**

Yo‘nalish: fresh bowls, salatlar va tabiiy ichimliklar

Demo aloqa: `+998 71 200 77 77`
