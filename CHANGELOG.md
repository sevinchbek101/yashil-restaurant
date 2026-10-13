# Changelog

## Version 17 — Professional UI/UX polish

- Google Fonts’dan `Manrope` va `Fraunces` to‘liq ulandi; matn, sarlavha, qator oralig‘i va shrift qalinliklari yagona tipografik tizimga keltirildi.
- Bosh sahifa, menyu, kuzatuv, checkout va admin panel kartalariga zamonaviy bo‘shliqlar, nozik chegaralar hamda yumshoq soyalar qo‘shildi.
- Tugma, navigatsiya, taom kartasi, forma va boshqaruv elementlariga silliq hover, focus va active holatlari berildi.
- Sahifa ochilishida yengil kirish animatsiyalari qo‘shildi; `prefers-reduced-motion` sozlamasi saqlandi.
- Mobil va desktop oraliqlari, kartalar radiusi va vizual ierarxiya qayta muvozanatlandi.
- Asosiy sayt strukturasi, buyurtma oqimi, to‘lov, kuzatuv va admin funksiyalari o‘zgartirilmadi.

## Version 16 — Splash screen animatsiya va yangi shriftlar

- Sayt ochilganda to’liq ekranli splash screen qo’shildi: yashil fonda aylonuvchi loader va "Yuklanmoqda…" yozuvi, keyin "Tayyor" matni pastga tushib keladi; minimum 1.2 soniya ko’rsatiladi.
- Asosiy shrift `Inter` o’rniga `DM Sans` ga almashtirildi — zamonaviy va o’qilishi qulay.
- Sarlavhalar (`h1`, `h2`) uchun `Fraunces` serif fonti qo’shildi — editorial va chiroyli ko’rinish.
- `prefers-reduced-motion` media query’si orqali animatsiya qurilma sozlamasiga hurmat qiladi.

## Version 15 — Moslashuvchan kuzatuv va rasmiy to’lov logolari

- Buyurtmani kuzatishda endi telefon yoki buyurtma ID’sining bittasi yetarli.
- ID bo‘yicha qidiruv faqat shu buyurtmani, telefon bo‘yicha qidiruv esa shu raqamga tegishli barcha buyurtmalarni ko‘rsatadi.
- Bir nechta natija alohida kuzatuv kartalarida chiqadi va faol buyurtmalar har 10 soniyada yangilanadi.
- Kuzatuv ko‘rsatmalari o‘zbek, rus va ingliz tillarida yangilandi.
- Click, Payme, Uzcard, Humo, Plum, Paylov, Xazna va Oson rasmlari tozalab kesildi va haqiqiy logo sifatida kartochkalarga qo‘yildi.
- Avto to‘lov oqimi o‘zgarmadi va foydalanuvchi tekshiruvida muvaffaqiyatli ishladi.
- Production build va Version 15 deployment muvaffaqiyatli yakunlandi.

## Version 14 — Tanish to‘lov tizimlari bilan sodda tanlov

- Mijozga tushunarsiz “CHECKOUT avto to‘lovi” nomi olib tashlandi.
- Onlayn to‘lovlar Click, Payme, Uzcard/Humo, Plum, Paylov, Xazna va Oson kartochkalari ko‘rinishida chiqarildi.
- Istalgan onlayn kartochka tanlanganda avvalgi xavfsiz CHECKOUT.UZ invoice va hosted-payment oqimi ishlashda davom etadi.
- O‘zbek, rus va ingliz tillaridagi yordamchi matnlar yangilandi.
- Kartochkalar desktop va mobil ekranlar uchun moslashtirildi.
- Production build va Version 14 deployment muvaffaqiyatli yakunlandi.

## Version 13 — CHECKOUT.UZ avtomatik to‘lov

- Buyurtma formasida aniq ikki tanlov qoldirildi: “Olganda to‘layman” va “CHECKOUT avto to‘lovi”.
- Avto to‘lov tanlanganda xaridor CHECKOUT.UZ hosting sahifasiga yo‘naltiriladi; unda kassada yoqilgan Payme, Click, Uzcard/Humo va boshqa usullar ko‘rinadi.
- CHECKOUT.UZ API kalitini admin paneldagi Sozlamalar bo‘limidan kiritish, tekshirish, almashtirish va o‘chirish qo‘shildi.
- API kaliti AES-GCM bilan shifrlanib D1 bazasida saqlanadi; shifrlash kaliti alohida Sites runtime secret bo‘lib, API kaliti brauzerga qaytarilmaydi.
- Imzosiz webhook uchun maxfiy URL tokeni va server tomonda `status_payment` orqali qayta tekshirish qo‘shildi.
- To‘lov holati admin buyurtmalarida va mijozning kuzatish sahifasida ko‘rsatiladi.
- CHECKOUT’dan qaytilganda oxirgi buyurtma avtomatik tekshiriladi.
- `orders` jadvaliga to‘lov holati va CHECKOUT invoice identifikatorlari uchun yangi D1 migratsiya qo‘shildi.
- Production build va Version 13 deployment muvaffaqiyatli yakunlandi.

## Version 12 — Alohida admin login va o‘qilishi yaxshilangan dizayn

- Ommaviy desktop va mobil navigatsiyadan Admin tugmasi olib tashlandi.
- `/admin` manzili alohida login sahifasiga o‘tkazildi.
- Admin login va paroli Sites runtime secrets ichida saqlanadi; kod va GitHub ichiga production parol yozilmaydi.
- 12 soatlik, HMAC bilan imzolangan `HttpOnly`, `Secure`, `SameSite=Strict` sessiya cookie’si qo‘shildi.
- Admin API o‘qish va yozish amallari yangi sessiya bilan himoyalandi.
- Kategoriya ostidagi nuqta olib tashlanib, faol kategoriya yumaloq pill ichiga olindi.
- Sarlavha, tavsif va kartalardagi qator oralig‘i o‘qishga qulaylashtirildi.
- Google Fonts’dagi Manrope shriftiga fallback bilan o‘tildi; Solar Broken ikonka uslubi saqlandi.
- Login sahifasiga moslashuvchan dizayn va yengil mikroanimatsiyalar qo‘shildi.
- Build hamda jonli autentifikatsiya holatlari tekshirildi.

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

