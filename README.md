# Store & Share - Solar Revenue Optimization Platform

**Store & Share** is an investor demo grade solar battery revenue-share platform built specifically for Indian housing societies (with seed portfolios across **Nagpur**, **Patna**, and **Delhi**).

The platform tracks midday surplus solar generation, charges on-premises battery banks, discharges energy during peak hours to offset expensive grid tariffs, and calculates/distributes monthly revenue splits (60% to housing societies, 40% to Store & Share operations) under strict compliance with regional DISCOM electricity regulations.

---

## 🚀 Quick Demo Logins

If database seeds are applied, use these credentials at `/login` to access dashboard states:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Global Administrator** | `admin@storeandshare.in` | `admin123` |
| **Nagpur Manager** | `nagpur1@storeandshare.in` | `manager123` |
| **Patna Manager** | `patna1@storeandshare.in` | `manager123` |
| **Delhi Manager** | `delhi1@storeandshare.in` | `manager123` |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14+ (App Router, Server Actions, Dynamic Middleware Routing)
- **Styling**: Tailwind CSS v4 (Glassmorphism Dark Theme, Emerald Teal primary, Amber accent)
- **Component System**: shadcn/ui + Lucide Icons
- **Database ORM**: Prisma v6 + `@prisma/adapter-neon` serverless driver
- **Authentication**: NextAuth.js credentials-based role provider (`ADMIN` vs `SOCIETY_MANAGER`)
- **Projections Charting**: Recharts (safeguarded against hydration mismatches)

---

## 💻 Local Setup & Execution

Follow these steps to run the platform locally or verify correctness:

### 1. File Configurations
Clone this repository and create a `.env` file matching the template structure in `.env.example`:
```bash
# Connection string (transaction pooled)
DATABASE_URL="postgresql://[user]:[password]@[neon-host]/[db]?sslmode=require&pgbouncer=true"

# Connection string (direct unpooled for migrations)
DIRECT_URL="postgresql://[user]:[password]@[neon-host]/[db]?sslmode=require"

# JWT encryption secret
NEXTAUTH_SECRET="some_cryptographically_secure_hash"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Deploy Database Migrations & Schemas
Compile Prisma client bindings and push database schemas directly to the Neon serverless endpoint:
```bash
npx prisma db push
```

### 4. Seed Seed-Data Sets
Load 9 societies, 75 days of daily solar output logs, B2B leads, and simulated monthly transaction ledger logs into the active database:
```bash
npm run db:seed
```

### 5. Launch Local Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to analyze the live application.

---

## ⚡ Deployment to Vercel

The backend architecture is pre-configured to build on Vercel out of the box.

1. Create a new Next.js project in your **Vercel Dashboard**.
2. Connect your repository.
3. Configure the following **Environment Variables**:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set this to your newly deployed Vercel domain e.g. `https://your-app.vercel.app`)
4. Vercel will trigger the build script. The `postinstall` hook registered in `package.json` will automatically runs `prisma generate` prior to bundling the app, assuring typescript assets resolve cleanly.

---

## 📄 Compliance Statement (India Grid Regulations)
Store & Share complies with electricity distribution laws:
- **No grid bypass / direct power selling**: We operate strictly as an optimization load-balancing vendor.
- **DISCOM Integrity**: The physical electricity never wheels between distinct consumer accounts, meaning no distribution or regulatory trading licenses are required.
