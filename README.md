# Share StreamElements Overlays

Easily share StreamElements overlays with your friends. Built with Next.js, NextAuth.js, Vercel, Prisma, and Tailwind.

![Install overlay](https://github.com/sgbj/streamelements-overlays/assets/5178445/f2609391-0d60-4def-b762-80737a74c392)

![Share and manage overlays](https://github.com/sgbj/streamelements-overlays/assets/5178445/2bd934fd-57e3-40ba-8b5d-e8ccc81bd3b0)

## Features

* 🔗 Create and manage links to share StreamElements overlays
* 🪄 Install overlays at the click of a button
* 🔐 Authentication using NextAuth.js and StreamElements OAuth
* 📊 PostgreSQL database with Prisma ORM
* ✨ Responsive UI and light/dark mode built with Tailwind and shadcn/ui
* 🚀 Deployed using Vercel

## Getting Started

### Clone the repo

```bash
git clone https://github.com/sgbj/streamelements-overlays.git
```

### Install dependencies

```bash
npm install
```

### Setup .env file

```env
NEXT_PUBLIC_URL=

STREAMELEMENTS_CLIENTID=
STREAMELEMENTS_CLIENTSECRET=
STREAMELEMENTS_REDIRECTURI=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

```

### Setup Prisma

```bash
npx prisma generate
npx prisma db push
```

### Start the app

```bash
npm run dev
```
