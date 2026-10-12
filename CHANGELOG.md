# Changelog

## Version 11 — Responsive yuqori menyu va admin xavfsizligi

- Logo chapda, navigatsiya markazda, amallar o‘ngda joylashgan yangi yuqori menyu yaratildi.
- Bosh sahifa, menyu va buyurtmani kuzatish sahifalari bitta umumiy header komponentiga o‘tkazildi.
- 1100 px va undan kichik ekranlar uchun hamburger menyu, ixcham til/admin/savat boshqaruvlari qo‘shildi.
- Joriy sahifa `aria-current` bilan belgilanadi; mobil menyu `aria-expanded` va Escape tugmasini qo‘llaydi.
- Sayt ommaga ochiq bo‘lgani sababli `/admin` va admin API amallari faqat loyiha egasi ChatGPT hisobiga cheklab qo‘yildi.
- PHP’ga ko‘chirish sayt dizayni va funksiyalari tugagandan keyingi alohida bosqichga qoldirildi.

## Version 10 — Antigravity uchun loyiha handoff hujjatlari

- Antigravity va boshqa coding agentlar avtomatik o‘qishi uchun `AGENTS.md` qo‘shildi.
- Sayt arxitekturasi, sahifalari, funksiyalari, API, D1 sxemasi, dizayn tizimi va xavfsizlik cheklovlari `PROJECT_HANDOFF.md` ichida to‘liq yozildi.
- Antigravity’ga yuborish uchun tayyor boshlang‘ich prompt qo‘shildi.
- GitHub versionlash va ChatGPT Sites deployment jarayonlari orasidagi farq hujjatlashtirildi.
- Bu hujjat yangilanishi; production sayt funksional kodi Version 9 holatida qoladi.

# Changelog

## Version 9 — Layout va animatsiya tuzatishlari

- Butun sahifaga qo‘llangan `transform` animatsiyasi olib tashlandi.
- Transform sabab fixed savat paneli viewportdan tashqariga chiqib, sahifani gorizontal siljitishi tuzatildi.
- `html`, `body`, savat fon qatlami va modal kengligi viewport ichida cheklab qo‘yildi.
- Taom kartalaridagi ortiqcha ketma-ket kirish animatsiyalari olib tashlandi.
- Modal, loader va skeleton animatsiyalari xavfsiz elementlarda saqlandi.
- Harakatli effektlar `prefers-reduced-motion: no-preference` bilan cheklab qo‘yildi.
- Version 8’dagi summa matni va pul ikonkasi o‘zgarishsiz saqlandi.

# Changelog

## Version 8 — Summa ikonkasini va animatsiyalarni yaxshilash

- Checkout oynasidagi “Taomlar” yozuvi “Summa”ga almashtirildi.
- Summa qatoriga Solar Icons `Broken` uslubidagi `MoneyBag` ikonka qo‘shildi.
- Buyurtma yuborish va buyurtma holatini tekshirish tugmalariga aylanuvchi loader qo‘shildi.
- Admin panel ma’lumotlari yuklanishiga ham loader qo‘shildi.
- Bosh sahifa va menyu ma’lumotlari yuklanayotganda skeleton kartalar ko‘rsatiladi.
- Sahifalar, modal oynalar va taom kartalariga silliq kirish animatsiyalari qo‘shildi.
- Tugmalar uchun hover va bosish mikroanimatsiyalari qo‘shildi.
- Harakatni kamaytirish tizim sozlamasi qo‘llab-quvvatlandi.

# Changelog

## Version 7 — Savatga qo‘shish ikonkasini yaxshilash

- “Savatga qo‘shish” tugmalaridagi oddiy `+` belgisi olib tashlandi.
- Solar Icons `Broken` uslubidagi `CartPlus` ikonka qo‘shildi.
- Yangi ikonka bosh sahifadagi namunaviy taomlar va to‘liq menyuda ishlaydi.
- Tugma ko‘rinishi o‘zbek, rus va ingliz tillarida bir xil saqlandi.

## Version 6 — Solar ikonkalari va kuzatuv tuzatishlari

- Solar Icons rasmiy React paketi va `Broken` uslubi qo‘shildi.
- Bosh sahifa, menyu, savat, til almashtirgich, kuzatuv bosqichlari va admin panel ikonkalari yangilandi.
- `Invalid Date` muammosi tuzatildi; yangi buyurtmalar aniq vaqt bilan saqlanadi.
- Eski noto‘g‘ri sanalar foydalanuvchiga ko‘rsatilmaydi.
- Kuzatuv bosqichidagi chiziq matnlar ustidan o‘tishi tuzatildi.
- Taomlar summasi, chegirma, yetkazib berish va jami summa alohida ko‘rsatiladi.
- Admin statistikasi noto‘g‘ri sana sabab buzilmasligi ta’minlandi.

## Version 5 — Ko‘p tilli sayt va menyu qidiruvi

- O‘zbek, rus va ingliz tillari qo‘shildi.
- Til almashtirgich bosh sahifa, menyu va buyurtma kuzatuvida ishlaydi.
- Menyuga taom nomi va tavsifi bo‘yicha tezkor qidiruv qo‘shildi.
- Qidiruv kategoriya filtrlari bilan birgalikda ishlaydi.

## Version 4 — Alohida menyu sahifasi

- Yangi `/menu` sahifasi va kategoriya filtrlari qo‘shildi.
- Bosh sahifada 3 ta mashhur taom qoldirildi.

## Version 3 — Buyurtmani kuzatish

- Yangi `/track` sahifasi qo‘shildi.
- Holat har 10 soniyada avtomatik yangilanadi.

## Version 2 — Admin panel

- Himoyalangan `/admin` paneli va Cloudflare D1 qo‘shildi.

## Version 1 — Birinchi ko‘rinish

- YASHIL restorani uchun landing sahifa, savat va buyurtma formasi yaratildi.
