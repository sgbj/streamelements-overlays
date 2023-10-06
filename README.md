# Share StreamElements Overlays

Easily share StreamElements overlays with your friends. Built with Next.js, NextAuth.js, Vercel, Prisma, and Tailwind.

![Install overlays](https://github.com/sgbj/streamelements-overlays/assets/5178445/50641e76-8e58-4a61-9677-62b82eff4d77)

![Manage and share overlays](https://github.com/sgbj/streamelements-overlays/assets/5178445/2f0f8248-e571-439b-a3db-6ff49f9eeec6)

## Features

* 🔗 Create and manage links to share StreamElements overlays
* 🪄 Install overlays at the click of a button
* 🔐 Authentication using NextAuth.js and StreamElements OAuth
* 📊 PostgreSQL database with Prisma ORM
* ✨ Responsive UI and light/dark mode built with Tailwind and shadcn/ui
* * 🚀 Deployed using Vercel

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
