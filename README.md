# YASHIL — sog‘lom taomlar restorani

YASHIL uchun to‘liq ishlaydigan ko‘p tilli buyurtma sayti: menyu qidiruvi, savat va checkout, buyurtmani kuzatish hamda himoyalangan admin panel.

## Joriy holat

- Sayt kodi: **Version 14**
- Hujjatlar: **Version 14**
- Logo chapda, menyu markazda joylashgan responsive yuqori navigatsiya
- Mobil qurilmalar uchun hamburger menyu
- Nuqtasiz, yumaloq pill ko‘rinishidagi kategoriya tanlash
- O‘zbek, rus va ingliz tillari
- Solar Icons `Broken` uslubidagi yagona ikonka tizimi
- Menyu qidiruvi, kategoriya filtrlari, savat va sodda to‘lov tanlovi: olganda to‘lash yoki Click, Payme, Uzcard/Humo, Plum, Paylov, Xazna va Oson kartochkalari
- `/track` orqali buyurtma va to‘lov holatini kuzatish
- `/admin` orqali login/parol bilan himoyalangan boshqaruv paneli; CHECKOUT.UZ API kaliti shu panelda kiritiladi, shifrlanadi va brauzerga qaytarilmaydi
- Cloudflare D1 ma’lumotlar bazasi

## Antigravity bilan davom ettirish

1. Repozitoriyni clone qiling.
2. Avval `AGENTS.md` va `PROJECT_HANDOFF.md` fayllarini o‘qing.
3. `ANTIGRAVITY_START_PROMPT.md` ichidagi tayyor promptni Antigravity’ga yuboring.
4. Ishni GitHub `main` branchidan boshlang; eski `version-N` branchlarini o‘zgartirmang.

Muhim: GitHub’ga push qilish jonli ChatGPT Sites saytini avtomatik yangilamaydi. Production deployment alohida Sites jarayonidan o‘tadi.

Sayt: https://yashil-bowl-uz.apt-snipe-2429.chatgpt.site
