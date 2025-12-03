# 🌍 Dharika - Technology for Social Transformation

<div align="center">

![Dharika Logo](public/dharika-logo.png)

**वसुधैव कुटुम्बकम् — The World is One Family**

*A youth-led digital platform connecting volunteers with underserved communities through food drives and teaching initiatives across India.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](https://dharika.org) • [Video Demo](#demonstration-video) • [Documentation](#documentation)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Impact & Scalability](#-impact--scalability)
- [Getting Started](#-getting-started)
- [Team](#-team)
- [UN SDG Alignment](#-un-sdg-alignment)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🎯 Problem Statement

### The Challenge

India faces critical challenges in two interconnected areas:

**1. Food Insecurity**
- Over **190 million** Indians are undernourished (FAO, 2023)
- **40%** of food produced in India is wasted annually
- Children in underserved communities often go to bed hungry while surplus food from restaurants and events goes to waste

**2. Educational Inequality**
- **32 million** children in India are out of school
- Rural and underserved communities lack access to quality education
- Limited platforms exist to connect willing volunteers with children who need mentorship

### The Gap

While there are millions of young Indians willing to volunteer, there's no unified, accessible platform that:
- Connects volunteers directly with communities in need
- Manages food surplus redistribution efficiently
- Organizes teaching drives with proper volunteer management
- Tracks impact and ensures accountability

---

## 💡 Our Solution

**Dharika** is a comprehensive digital platform that bridges the gap between willing volunteers and underserved communities through:

### 🍽️ Food Drives Initiative
- **Surplus Food Redistribution**: Connects restaurants, cafeterias, and event organizers with communities in need
- **Volunteer Coordination**: Enables youth to organize and participate in food distribution drives
- **Real-time Tracking**: Monitors meals distributed and communities served

### 📚 Teaching Drives Initiative
- **Volunteer Matching**: Connects students and professionals with children needing mentorship
- **Skill-based Sessions**: From basic literacy to spoken English, school subjects to life skills
- **Progress Tracking**: Monitors student progress and volunteer engagement

### 🔗 Unified Platform Features
- **Mobile-First Design**: Accessible on any device, optimized for low-bandwidth areas
- **Multi-language Support**: Designed for scalability across Indian languages
- **Admin Dashboard**: For NGO coordinators to manage volunteers and track impact
- **Automated Notifications**: Email confirmations and updates for volunteers

---

## ✨ Key Features

| Feature | Description | Technology |
|---------|-------------|------------|
| **Responsive Design** | Mobile-first, works on all devices | Tailwind CSS 4 |
| **Dynamic Content** | CMS-powered carousel and testimonials | Notion API |
| **Volunteer Registration** | Validated forms with spam protection | Zod + Honeypot |
| **Data Management** | Secure storage of volunteer data | Google Sheets API |
| **Email Notifications** | Automated confirmation emails | Resend API |
| **Admin Panel** | Manage images, volunteers, suggestions | Next.js App Router |
| **Performance Optimized** | ISR, image optimization, caching | Next.js 16 |
| **Accessibility** | WCAG 2.1 AA compliant | Semantic HTML |
| **SEO Optimized** | Sitemap, robots.txt, meta tags | Next.js Metadata |
| **Analytics** | Track user engagement | Vercel Analytics |

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
├── Notion API          # Headless CMS
├── Google Sheets API   # Data storage
├── Resend              # Transactional emails
└── Zod                 # Schema validation
```

### Infrastructure
```
├── Vercel              # Hosting & deployment
├── Cloudinary          # Image CDN
├── Neon Database       # PostgreSQL (optional)
└── GitHub Actions      # CI/CD
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
│  │  Notion  │  │ Google Sheets│  │       Resend         │   │
│  │   CMS    │  │   Database   │  │   Email Service      │   │
│  └──────────┘  └──────────────┘  └──────────────────────┘   │
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
│   │   └── page.tsx           # Main landing page
│   ├── components/
│   │   ├── sections/          # Page sections (Hero, About, etc.)
│   │   ├── ui/                # Reusable UI components
│   │   └── admin/             # Admin-specific components
│   ├── lib/
│   │   ├── notion.ts          # Notion API integration
│   │   ├── googleSheets.ts    # Google Sheets integration
│   │   ├── resend.ts          # Email service
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
└── scripts/                   # Utility scripts
```

---

## 📊 Impact & Scalability

### Current Impact

| Metric | Value |
|--------|-------|
| 🍽️ Meals Distributed | **1,000+** |
| 🏙️ Cities Served | **10+** |
| 👨‍🎓 Students Taught | **100+** |
| 🎓 Skill Workshops | **20+** |

### Scalability Plan

1. **Regional Expansion**
   - Multi-language support (Hindi, Tamil, Bengali, etc.)
   - State-specific volunteer networks
   - Local NGO partnerships

2. **Technical Scalability**
   - Serverless architecture handles traffic spikes
   - CDN-optimized images for fast loading
   - Database sharding for large datasets

3. **Feature Expansion**
   - Mobile app (React Native)
   - Real-time volunteer tracking
   - AI-powered volunteer-community matching
   - Impact analytics dashboard

### Sustainability Model

- **Zero Cost for Beneficiaries**: Platform is free for communities
- **Volunteer-Driven**: No paid staff for ground operations
- **Open Source**: Community contributions welcome
- **Partnership Model**: Collaborate with existing NGOs and CSR initiatives

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Notion account (for CMS)
- Google Cloud account (for Sheets API)
- Resend account (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dharika.git
cd dharika

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Environment Variables

```env
# Notion CMS
NOTION_API_KEY=your_notion_api_key
NOTION_CAROUSEL_DB_ID=your_carousel_database_id
NOTION_TESTIMONIALS_DB_ID=your_testimonials_database_id

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID_VOLUNTEER=your_volunteer_sheet_id
GOOGLE_SHEET_ID_SUGGESTION=your_suggestion_sheet_id

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Security
REVALIDATE_SECRET=your_revalidation_secret
ADMIN_PASSWORD=your_admin_password
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 👥 Team

| Role | Name | Expertise |
|------|------|-----------|
| **Team Lead** | [Name] | Full-Stack Development |
| **Member 2** | [Name] | UI/UX Design |
| **Member 3** | [Name] | Social Sciences / Community Outreach |

---

## 🌐 UN SDG Alignment

This project directly contributes to the following UN Sustainable Development Goals:

| SDG | Goal | Our Contribution |
|-----|------|------------------|
| ![SDG 1](https://img.shields.io/badge/SDG%201-No%20Poverty-E5243B) | No Poverty | Supporting underserved communities |
| ![SDG 2](https://img.shields.io/badge/SDG%202-Zero%20Hunger-DDA63A) | Zero Hunger | Food drives and surplus redistribution |
| ![SDG 4](https://img.shields.io/badge/SDG%204-Quality%20Education-C5192D) | Quality Education | Teaching drives for children |
| ![SDG 10](https://img.shields.io/badge/SDG%2010-Reduced%20Inequalities-DD1367) | Reduced Inequalities | Bridging urban-rural divide |
| ![SDG 12](https://img.shields.io/badge/SDG%2012-Responsible%20Consumption-BF8B2E) | Responsible Consumption | Reducing food waste |
| ![SDG 17](https://img.shields.io/badge/SDG%2017-Partnerships-19486A) | Partnerships | Connecting volunteers with communities |

---

## 🗺️ Future Roadmap

### Phase 1 (Q1 2026)
- [ ] Mobile application launch
- [ ] Multi-language support (5 Indian languages)
- [ ] Real-time volunteer tracking

### Phase 2 (Q2 2026)
- [ ] AI-powered volunteer matching
- [ ] Impact analytics dashboard
- [ ] Integration with government schemes

### Phase 3 (Q3 2026)
- [ ] Pan-India expansion (all 36 states/UTs)
- [ ] Corporate volunteer programs
- [ ] Gamification for volunteer engagement

---

---

## 🎥 Demonstration Video

[Watch our 3-5 minute demo video showcasing the platform](https://youtube.com/your-demo-video)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

## 📞 Contact

- **Email**: Dharika.co@gmail.com
- **Location**: Ambala City, 134004, Haryana, India
- **Instagram**: [@dharika.in](https://www.instagram.com/dharika.in)
- **LinkedIn**: [Dharika](https://www.linkedin.com/in/siya-sethi-a2439a301)

---

<div align="center">

**Built with ❤️ for Viksit Bharat 2047**

*Think Global, Hack Local — Technology for Social Transformation*

</div>
