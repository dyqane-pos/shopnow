# ShopNow — Udhëzues i plotë për deployment
## Stack: Next.js 14 · Supabase · GitHub · Vercel

---

## HAPI 1 — Supabase (Database + Storage + Auth)

### 1.1 Krijo projektin
1. Shko te **https://supabase.com** → "New project"
2. Vendos emrin e projektit, fjalëkalimin e DB-së, zgjedh rajonin (Europe Frankfurt)
3. Prit ~2 minuta derisa projekti të inicializohet

### 1.2 Ekzekuto SQL Schema
1. Supabase Dashboard → **SQL Editor** → "New query"
2. Kopjo të gjithë përmbajtjen e skedarit `supabase-schema.sql`
3. Kliko **Run** — do të krijohen automatikisht:
   - Tabela: `profiles`, `products`, `orders`, `wishlist`, `product_views`
   - RLS Policies (siguria)
   - Storage Bucket: `product-images` (public)
   - Trigger: profil automatik pas regjistrimit
   - 6 produkte fillestare (seed data)

### 1.3 Merr çelësat API
Supabase Dashboard → **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon / public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key ⚠️ mos e publiko!

### 1.4 Krijo Super Admin
1. Supabase → **Authentication → Users → Add user**
2. Fut email + fjalëkalim për adminin kryesor
3. Pastaj shko te **Table Editor → profiles**
4. Gjej rekordin me emailin tënd dhe ndrysho `role` nga `user` → `superadmin`

### 1.5 Konfiguro Auth (opsional por i rekomanduar)
Supabase → **Authentication → URL Configuration**:
- Site URL: `https://shopnow-XXXXXXXXX.vercel.app` (URL-ja e Vercel pas deployment)
- Redirect URLs: shto URL-n e Vercel + `http://localhost:3000`

---

## HAPI 2 — GitHub

### 2.1 Krijo repository
```bash
# Klono/shkarko kodin dhe hap terminal në folder
cd shopnow
git init
git add .
git commit -m "Initial commit: ShopNow with Supabase"
```

### 2.2 Ngarko në GitHub
```bash
# Krijo repo të ri në github.com (pa README)
git remote add origin https://github.com/USERNAME/shopnow.git
git branch -M main
git push -u origin main
```

---

## HAPI 3 — Vercel (Deployment)

### 3.1 Lidh me GitHub
1. Shko te **https://vercel.com** → "Add New Project"
2. Importo repo-n `shopnow` nga GitHub
3. Framework: **Next.js** (detektohet automatikisht)

### 3.2 Shto Environment Variables
Kliko **"Environment Variables"** dhe shto:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGci... |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGci... |
| `NEXT_PUBLIC_APP_URL` | https://shopnow-xxx.vercel.app |

### 3.3 Deploy
Kliko **Deploy** — Vercel do të:
- Instalojë dependencies
- Build-ojë Next.js
- Publikojë automatikisht URL publike

### 3.4 Auto-Deploy (pas kësaj)
Çdo `git push origin main` → Vercel ndërton dhe publikon automatikisht!

```bash
# Workflow i zakonshëm
git add .
git commit -m "Shtova produkt të ri"
git push origin main
# → Vercel deployon në ~30 sekonda
```

---

## HAPI 4 — Shto Admins të Tjerë (nga aplikacioni)

Pas deployment:
1. Hyr si **superadmin**
2. Kliko butonin **ADMIN** në header
3. Skeda **"Adminët"** → "Shto Admin të ri"
4. Fut emrin, emailin dhe fjalëkalimin e adminit të ri
5. Admini i ri mund të hyjë menjëherë dhe të menaxhojë produkte

---

## NGARKIMI I FOTOVE NGA CELULARI

1. Admin hyn nga telefoni te URL-ja e dyqanit
2. Kliko **ADMIN** → "Shto produkt"
3. Tap-o zonën e fotografisë → hapet galeria ose kamera
4. Zgjidh ose fotografo produktin
5. Plotëso emrin, çmimin etj.
6. Kliko **"Shto produktin"**
7. Foto ngarkohet direkt në Supabase Storage dhe shfaqet menjëherë!

---

## STRUKTURA E PROJEKTIT

```
shopnow/
├── app/
│   ├── globals.css          # Stilet AboutYou
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Faqja kryesore (shop + admin + auth)
├── lib/
│   ├── supabase.ts          # Client-side Supabase
│   ├── supabase-server.ts   # Server-side Supabase
│   └── types.ts             # TypeScript types
├── supabase-schema.sql      # SQL i plotë (ekzekuto 1 herë)
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.local.example       # Shembull variablash
```

---

## FEATURES

| Feature | Implementuar |
|---------|-------------|
| Auth (login/register) | ✅ Supabase Auth |
| Rolet (user/admin/superadmin) | ✅ |
| Shikimi i produkteve | ✅ |
| Shtimi i produkteve + foto | ✅ Supabase Storage |
| Ngarkimi nga celulari | ✅ |
| Shporta | ✅ localStorage |
| Porositë | ✅ Supabase DB |
| Wishlist | ✅ Supabase DB |
| Statistikat e shikimeve | ✅ |
| RLS Security | ✅ |
| Auto-deploy | ✅ Vercel + GitHub |

---

## KOMANDA PËR ZHVILLIM LOKAL

```bash
# 1. Instalimi i dependencies
npm install

# 2. Krijo .env.local nga shembulli
cp .env.local.example .env.local
# Edito .env.local me çelësat e Supabase-it

# 3. Nis serverin lokal
npm run dev
# → http://localhost:3000
```
