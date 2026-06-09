# Bolalar adabiyoti — Test

O'zbek bolalar adabiyoti fanidan **351 ta savol**lik test sayti.
Sof HTML/CSS/JS — hech qanday build kerak emas, to'g'ridan-to'g'ri Vercel'ga deploy bo'ladi.

## Fayllar

| Fayl | Vazifasi |
|------|----------|
| `index.html` | Sahifa tuzilishi (start / test / natija ekranlari) |
| `styles.css` | Dizayn va ranglar |
| `script.js` | Test mantiqi (savol, baholash, natija) |
| `questions.js` | Savollar bazasi (`window.QUESTIONS`) |

## Imkoniyatlar

- Savol sonini tanlash: 10 / 20 / 50 / hammasi
- Ikki rejim: **Mashq** (javob darhol ko'rinadi) va **Imtihon** (natija oxirida)
- Savollar va variantlar aralashtiriladi
- Klaviatura: `1–4` yoki `A–D` bilan javob, `Enter` bilan keyingi savol
- Oxirida foiz, to'g'ri javoblar soni va **xatolar ro'yxati**
- Eng yaxshi natija brauzerda saqlanadi
- Telefon va kompyuterda bir xil ishlaydi

## GitHub'ga yuklash

```bash
cd bolalar-adabiyoti-test     # papka nomi
git init
git add .
git commit -m "Bolalar adabiyoti test sayti"
git branch -M main
git remote add origin https://github.com/FOYDALANUVCHI/REPO.git
git push -u origin main
```

> `FOYDALANUVCHI/REPO` o'rniga o'z GitHub manzilingizni yozing.

## Vercel'ga deploy qilish

1. [vercel.com](https://vercel.com) ga GitHub bilan kiring.
2. **Add New → Project** → reponi tanlang → **Import**.
3. Framework: **Other** (o'zgartirmang), build sozlamalari bo'sh qoladi.
4. **Deploy** tugmasini bosing.

Bir necha soniyada `https://repo-nomingiz.vercel.app` ko'rinishidagi havola tayyor bo'ladi.

## Savol qo'shish / o'zgartirish

`questions.js` ichidagi massivga yangi obyekt qo'shing:

```js
{ "id": 352, "q": "Savol matni?", "options": ["A", "B", "C", "D"], "answer": 1 }
```

`answer` — to'g'ri variantning tartib raqami (0 dan boshlanadi: A=0, B=1, C=2, D=3).
