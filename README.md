# 🌍 Dharika Foundation - Technology for Social Transformation

<div align="center">

![Dharika Logo](public/dharika-logo.png)

**वसुधैव कुटुम्बकम् — The World is One Family**

*A youth-led digital platform connecting volunteers with underserved communities through food drives, teaching initiatives, and digital learning support across India.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](https://dharika-ngo.vercel.app) • [Documentation](#documentation)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Current Implementation](#-current-implementation)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Future Roadmap](#-future-roadmap)
- [UN SDG Alignment](#-un-sdg-alignment)
- [License](#-license)

---

## 🎯 Problem Statement

### The Challenge

India faces critical challenges in interconnected areas:

**1. Food Insecurity**
- Over **190 million** Indians are undernourished (FAO, 2023)
- **40%** of food produced in India is wasted annually
- Surplus food from restaurants and events goes to waste while communities go hungry

**2. Educational Inequality**
- **32 million** children in India are out of school
- Rural and underserved communities lack access to quality education
- Limited platforms exist to connect willing volunteers with children who need mentorship

### The Gap

While there are millions of young Indians willing to volunteer, there's no unified, accessible platform that:
- Connects volunteers directly with communities in need
- Manages food surplus redistribution efficiently
- Organizes teaching drives with proper volunteer management
- Provides digital learning support for underprivileged students

---

## 💡 Our Solution

**Dharika Foundation** is a comprehensive digital platform that bridges the gap between willing volunteers and underserved communities.

### 🍽️ Food Drives Initiative
- **Surplus Food Redistribution**: Connects restaurants, cafeterias, and event organizers with communities in need
- **Volunteer Coordination**: Enables youth to organize and participate in food distribution drives
- **Real-time Tracking**: Monitors meals distributed and communities served

### 📚 Teaching Drives Initiative
- **Volunteer Matching**: Connects students and professionals with children needing mentorship
- **Skill-based Sessions**: From basic literacy to spoken English, school subjects to life skills
- **Progress Tracking**: Monitors student progress and volunteer engagement

### 🔗 Platform Features
- **Mobile-First Design**: Accessible on any device, optimized for low-bandwidth areas
- **Admin Dashboard**: For NGO coordinators to manage volunteers and track impact
- **Automated Notifications**: Email confirmations and updates for volunteers
- **Google Sheets Integration**: Lightweight data management for scalability

---

## ✅ Current Implementation

### Core Features (Implemented)

| Feature | Status | Technology | File Reference |
|---------|--------|------------|----------------|
| **Volunteer Registration Form** | ✅ Complete | Zod + React | `src/components/sections/JoinFormSection.tsx` |
| **Form Validation** | ✅ Complete | Zod schemas | `src/lib/validations.ts` |
| **Duplicate Prevention** | ✅ Complete | Database check | `src/lib/db.ts` |
| **Google Sheets Sync** | ✅ Complete | Google Sheets API | `src/lib/googleSheets.ts` |
| **Email Notifications** | ✅ Complete | Resend API | `src/lib/resend.ts`, `src/lib/email-templates.tsx` |
| **Admin Dashboard** | ✅ Complete | Next.js App Router | `src/app/admin/page.tsx` |
| **Admin Login** | ✅ Complete | Cookie-based auth | `src/app/admin/login/page.tsx` |
| **Image Management** | ✅ Complete | Cloudinary | `src/app/admin/images/page.tsx` |
| **Suggestion Form** | ✅ Complete | API Route | `src/app/api/suggestion/route.ts` |
| **Responsive Design** | ✅ Complete | Tailwind CSS 4 | `src/app/globals.css` |
| **SEO Optimization** | ✅ Complete | Next.js Metadata | `src/app/layout.tsx` |
| **Analytics** | ✅ Complete | Vercel Analytics | `src/app/layout.tsx` |
| **Performance Monitoring** | ✅ Complete | Vercel Speed Insights | `src/app/layout.tsx` |

### API Endpoints (Implemented)

| Endpoint | Method | Purpose | File |
|----------|--------|---------|------|
| `/api/volunteer` | POST | Volunteer registration | `src/app/api/volunteer/route.ts` |
| `/api/suggestion` | POST | Feedback submission | `src/app/api/suggestion/route.ts` |
| `/api/admin/auth` | POST/DELETE | Admin authentication | `src/app/api/admin/auth/route.ts` |
| `/api/admin/volunteers` | GET | List volunteers | `src/app/api/admin/volunteers/route.ts` |
| `/api/admin/suggestions` | GET | List suggestions | `src/app/api/admin/suggestions/route.ts` |
| `/api/admin/section-images` | GET/PUT | Manage images | `src/app/api/admin/section-images/route.ts` |
| `/api/admin/upload-image` | POST | Upload images | `src/app/api/admin/upload-image/route.ts` |

### Data Flow (Current)

```
User submits form
    ↓
Validation (Zod schema)
    ↓
Duplicate check (phone/email)
    ↓
Save to Neon Database
    ↓
Sync to Google Sheets (IST timestamp)
    ↓
Send admin email notification
    ↓
Return success response
```

### Scripts Available

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:init      # Initialize database tables
npm run db:test      # Test database connection
npm run sheets:init  # Initialize Google Sheets headers
npm run sheets:sync  # Sync database to Google Sheets
```

---

## 🛠️ Technology Stack

### Frontend
```
├── Next.js 16          # React framework with App Router
├── TypeScript 5        # Type-safe development
├── Tailwind CSS 4      # Utility-first styling
├── Framer Motion       # Smooth animations
└── Embla Carousel      # Touch-friendly carousels
```

### Backend & APIs
```
├── Next.js API Routes  # Serverless functions
├── Neon Database       # PostgreSQL database
├── Google Sheets API   # Data backup/sync
├── Resend              # Transactional emails
├── Cloudinary          # Image CDN & management
└── Zod                 # Schema validation
```

### Infrastructure
```
├── Vercel              # Hosting & deployment
├── Vercel Analytics    # User behavior tracking
├── Vercel Speed Insights # Performance monitoring
└── GitHub              # Version control
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Mobile    │  │   Desktop   │  │   Admin Dashboard   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   App Router                         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    │
│  │  │  Pages   │  │   API    │  │   Middleware     │   │    │
│  │  │ (SSR/ISR)│  │  Routes  │  │ (Rate Limiting)  │   │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Neon   │  │ Google Sheets│  │       Resend         │   │
│  │ Database │  │   (Backup)   │  │   Email Service      │   │
│  └──────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌──────────┐  ┌──────────────┐                             │
│  │Cloudinary│  │   Vercel     │                             │
│  │  Images  │  │  Analytics   │                             │
│  └──────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
dharika/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── volunteer/     # Volunteer registration
│   │   │   ├── suggestion/    # Feedback submission
│   │   │   └── admin/         # Admin operations
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── page.tsx       # Main admin page
│   │   │   ├── login/         # Admin login
│   │   │   └── images/        # Image management
│   │   └── page.tsx           # Main landing page
│   ├── components/
│   │   ├── sections/          # Page sections (Hero, About, etc.)
│   │   ├── ui/                # Reusable UI components
│   │   └── admin/             # Admin-specific components
│   ├── lib/
│   │   ├── db.ts              # Database operations
│   │   ├── googleSheets.ts    # Google Sheets integration
│   │   ├── resend.ts          # Email service
│   │   ├── email-templates.tsx # Email templates
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
└── scripts/                   # Utility scripts
    ├── init-db.ts             # Database initialization
    ├── init-google-sheets.ts  # Sheets header setup
    └── sync-volunteers-to-sheets.ts # DB to Sheets sync
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Neon Database account
- Google Cloud account (for Sheets API)
- Resend account (for emails)
- Cloudinary account (for images)

### Installation

```bash
# Clone the repository
git clone https://github.com/SureshKumar-24/dharika_ngo.git
cd dharika

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Initialize database
npm run db:init

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="Dharika <onboarding@resend.dev>"
ADMIN_EMAIL_TO=admin@dharika.org

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
ADMIN_PASSWORD=your_admin_password
REVALIDATE_SECRET=your_revalidation_secret
```

---

## 🗺️ Future Roadmap

### Phase 1: EdTech Micro-Learning Module (Planned)

**Student Support System** - Let underprivileged students submit learning queries → volunteers receive the query → teachers create topic-specific videos → students receive video links.

| Feature | Status | Description |
|---------|--------|-------------|
| Student Query Form | 🔜 Planned | Name, Age, City, Class, Subject, Topic, Phone, Email |
| Auto Email to Student | 🔜 Planned | Thank you + 12-hour response promise |
| Admin WhatsApp Alert | 🔜 Planned | New query notification via WATI/Interakt |
| Teacher Distribution | 🔜 Planned | WhatsApp group workflow |
| YouTube Video Delivery | 🔜 Planned | Unlisted link delivery to student |
| Student Dashboard | 🔜 Future | Query history, video library |
| Teacher Dashboard | 🔜 Future | Assigned queries, leaderboard |
| Topic Repository | 🔜 Future | Searchable by class/subject/topic |

### Phase 2: Food Rescue Module (Planned)

**Surplus Food Donation System** - Local cafeterias/restaurants submit surplus food availability → admins receive alerts → volunteers are notified → food is picked up & delivered with geotag proof.

| Feature | Status | Description |
|---------|--------|-------------|
| Food Alert Form | 🔜 Planned | Donor type, establishment, contact, address, quantity, time, photo |
| Validation + Liability | 🔜 Planned | Declaration checklist, legal disclaimer popup |
| Admin WhatsApp Alert | 🔜 Planned | Food alert notification with assignment |
| Volunteer Assignment | 🔜 Planned | City-specific WhatsApp group workflow |
| Pickup Validation | 🔜 Planned | Geotagged photos (pickup + delivery) |
| Auto-routing | 🔜 Future | Nearest volunteer using radius |
| Pickup Receipt | 🔜 Future | Auto-generated receipt |
| Donor Dashboard | 🔜 Future | Donation history, impact stats |
| Volunteer Leaderboard | 🔜 Future | Gamification for engagement |

### Phase 3: Platform Enhancements (Future)

| Feature | Status | Description |
|---------|--------|-------------|
| WhatsApp Business API | 🔜 Planned | WATI/Interakt/msg91 integration |
| Multi-language Support | 🔜 Planned | Hindi + English headings |
| Hero Section Update | 🔜 Planned | "Digital learning support + food rescue network" banner |
| Admin Resources Page | 🔜 Planned | Links to sheets, WhatsApp groups, instructions |
| Phone Number Masking | 🔜 Planned | Privacy protection in admin views |
| Mobile App | 🔜 Future | React Native app |
| AI Volunteer Matching | 🔜 Future | Smart assignment based on location/skills |
| Impact Analytics | 🔜 Future | Dashboard with metrics and visualizations |

### Navigation Structure (Planned)

```
Current:
├── Home
├── About
├── Food Drives
├── Teaching Drives
├── Join Us
└── Connect

Planned Addition:
├── Student Support (Free Learning Help) → Student Query Form
└── Donate Surplus Food → Food Alert Form
```

---

## 🌐 UN SDG Alignment

| SDG | Goal | Our Contribution |
|-----|------|------------------|
| ![SDG 1](https://img.shields.io/badge/SDG%201-No%20Poverty-E5243B) | No Poverty | Supporting underserved communities |
| ![SDG 2](https://img.shields.io/badge/SDG%202-Zero%20Hunger-DDA63A) | Zero Hunger | Food drives and surplus redistribution |
| ![SDG 4](https://img.shields.io/badge/SDG%204-Quality%20Education-C5192D) | Quality Education | Teaching drives + digital learning support |
| ![SDG 10](https://img.shields.io/badge/SDG%2010-Reduced%20Inequalities-DD1367) | Reduced Inequalities | Bridging urban-rural divide |
| ![SDG 12](https://img.shields.io/badge/SDG%2012-Responsible%20Consumption-BF8B2E) | Responsible Consumption | Reducing food waste |
| ![SDG 17](https://img.shields.io/badge/SDG%2017-Partnerships-19486A) | Partnerships | Connecting volunteers with communities |

---

## 📊 Impact & Scalability

### Current Impact

| Metric | Value |
|--------|-------|
| 🍽️ Meals Distributed | **1,000+** |
| 🏙️ Cities Served | **10+** |
| 👨‍🎓 Students Taught | **100+** |
| 🎓 Skill Workshops | **20+** |

### Scalability Principles

- **Minimal coding heavy-lift** — integrate where possible
- **Backend data storage** in Google Sheets (multiple sheets)
- **Notification system** via WhatsApp automation + email
- **Video hosting** through YouTube unlisted links
- **Future scalability** for app/dashboards

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

## 📞 Contact

- **Email**: dharika.co@gmail.com
- **Location**: Ambala City, 134004, Haryana, India
- **Instagram**: [@dharika.in](https://www.instagram.com/dharika.in)
- **LinkedIn**: [Dharika](https://www.linkedin.com/in/siya-sethi-a2439a301)

---

<div align="center">

**Built with ❤️ for Viksit Bharat 2047**

*Now offering digital learning support and India's first youth-driven food rescue network.*

</div>
