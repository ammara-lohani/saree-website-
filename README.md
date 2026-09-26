# Rivaayat Sarees (روایت) — Luxury Pakistani Saree Couture

<div align="center">
  <img src="public/favicon.svg" alt="Rivaayat Crest" width="90" height="90" />
  <h3>Rivaayat Sarees</h3>
  <p><strong>Timeless Elegance, Woven in Heritage</strong></p>
  <p>An editorial high-fashion Pakistani e-commerce web platform for artisanal sarees, handloom drapes, and bespoke bridal coutures.</p>
</div>

---

## 🌟 Overview

**Rivaayat Sarees** is a full-stack, responsive luxury e-commerce platform built specifically for Pakistani saree coutures. It showcases traditional textile craft (pure Katan Banarasi silks, celestial organzas, micro-velvet, delicate chiffons, resham needlework, and tilla borders) packaged inside an editorial high-fashion digital storefront and an admin management suite.

### Key Highlights

* **Brand & Visual System**: Royal maroon (`#5A121E`), antique gold (`#C5A059`), warm cream (`#FDFBF7`), and obsidian accents with classic editorial serif typography (*Cormorant Garamond* / *Playfair Display*).
* **Handcrafted Crest Logo**: Scalable Mughal octagonal crest with gold gradients, calligraphic monogram, saree drape swash, and imperial finial.
* **Pakistani Localization**: Pakistani Rupee (`PKR`) pricing tiers, major Pakistani cities shipping logic (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta), and Cash on Delivery (COD) workflow.
* **Full-Featured Storefront**:
  * Dynamic Homepage with Hero banner, Category cards, Curated Masterpieces, and Craftsmanship showcase.
  * Real-time multi-faceted catalog filtering (Category, Color swatches, Price range, In-stock status) and sorting.
  * Live search modal with fuzzy matching across fabrics, colors, titles, and descriptions.
  * Product detail page with multi-angle image gallery, color selectors, and blouse/care guides.
  * Cart slide-out drawer with free delivery progress bar.
  * Frictionless checkout with Cash on Delivery and instant order confirmation.
  * Customer accounts with order tracking timelines (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered`).
* **Admin Management Suite** (`/admin`):
  * **Analytics & KPI Dashboard**: Gross sales, order count, AOV, monthly revenue chart, and category sales breakdown.
  * **Product Management**: Complete CRUD with image URLs, fabric specifications, stock, and status flags.
  * **Category Management**: Dynamic category CRUD with image links, slug management, and instant live updates across storefront.
  * **Order Management**: Order inspection, real-time status transitions, and restock on cancellation.
  * **Inventory Management**: Critical low-stock monitoring (< 5 units) and inline stock adjustment.
  * **Customer Directory**: Registered members, guest shoppers, and lifetime spend history.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions & Route Handlers)
* **Language**: TypeScript
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (zero external database configuration required)
* **Authentication**: JWT authentication with `jose` and `bcryptjs`
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ammara-lohani/saree-website-.git
cd saree-website-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database & Seed Catalog

Run the automated setup command to push the Prisma schema and seed 20 realistic Pakistani sarees, 8 categories, demo accounts, and orders:

```bash
npm run setup
```

*(Alternatively: `npx prisma db push` followed by `npm run seed`)*

### 4. Run Development Server

```bash
npm run dev
```

Open [https://saree-website-five.vercel.app/](https://saree-website-five.vercel.app/) (or whichever port Next.js binds to) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin Director** | `admin@rivaayat.pk` | `AdminPassword123!` | Full Admin Portal (`/admin`) |
| **Customer (VIP)** | `ayesha.khan@example.com` | `CustomerPassword123!` | Customer Storefront & Orders (`/account`) |

*Tip: Quick 1-click demo login buttons are provided on the `/login` page.*

---

## 📁 Project Architecture

```
sarees/
├── app/
│   ├── (storefront routes)/
│   │   ├── about/              # Brand story & heritage atelier
│   │   ├── account/            # Customer profile & order history
│   │   ├── cart/               # Standalone shopping cart
│   │   ├── categories/         # Dedicated category showcase
│   │   ├── checkout/           # Shipping & COD checkout
│   │   ├── login/ & register/  # Branded authentication
│   │   ├── order-confirmation/ # Order invoice receipt
│   │   ├── product/[id]/       # Product detail & gallery
│   │   └── shop/               # Filterable product catalog
│   ├── admin/                  # Protected Admin Management Suite
│   ├── api/                    # RESTful Next.js API endpoints
│   ├── icon.svg                # Dynamic browser tab favicon
│   ├── layout.tsx              # Root HTML layout with providers
│   └── page.tsx                # High-fashion homepage
├── components/
│   ├── CartDrawer.tsx          # Slide-out cart with delivery counter
│   ├── Footer.tsx              # Luxury dark footer with newsletter
│   ├── Logo.tsx                # Royal crest emblem + typography
│   ├── Navbar.tsx              # Sticky navigation & announcement bar
│   ├── ProductCard.tsx         # Product grid card with hover effects
│   └── SearchModal.tsx         # Real-time search dialog
├── context/
│   ├── AuthContext.tsx         # User session & credentials
│   ├── CartContext.tsx         # LocalStorage persistent shopping bag
│   └── WishlistContext.tsx     # Favorite sarees management
├── prisma/
│   ├── schema.prisma           # Relational SQLite database schema
│   └── seed.ts                 # Catalog and demo data seed script
└── public/
    └── favicon.svg             # Vector favicon asset
```

---

## 📜 License

Created for Rivaayat Sarees Pvt. Ltd. All rights reserved.
