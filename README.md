<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# TechFix Peshawar — On-Site Computer Support & System Diagnostics

TechFix Peshawar is a professional on-site computer support, hardware diagnostic, and IT service platform operating across Peshawar, Khyber Pakhtunkhwa.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, Nodemailer, Resend
- **Database & Auth:** Firebase Authentication, Cloud Firestore
- **Deployment:** Vercel / Node server

## Features

- **On-Site Booking System:** Instant scheduling for computer repairs, Windows setups, and SSD upgrades.
- **Direct Lead & Inquiry Dispatch:** Customer inquiries dispatched in real-time with auto-failover notification waterfalls (Gmail SMTP & Resend).
- **Secure Administrator Panel:** Cryptographic Firebase ID token-verified dashboard for managing bookings, CMS content, services, FAQs, and system settings.
- **Real-Time Tracking:** Sanitized reference lookup protecting customer privacy.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

### Environment Configuration

Configure the following variables in `.env`:

```env
PORT=3000
NODE_ENV=development

# Email Notification System
RESEND_API_KEY=
RESEND_FROM=Peshawar Tech Support <onboarding@resend.dev>
NOTIFICATION_TARGET_EMAIL=techfixpeshawar@gmail.com
GMAIL_USER=techfixpeshawar@gmail.com
GMAIL_APP_PASSWORD=

# Business Info
BUSINESS_PHONE=0327 5526107
BUSINESS_WHATSAPP=923275526107
```

### Development

```bash
# Run both Express server and Vite frontend
npm run dev
```

### Production Build

```bash
# Run type check and Vite production bundle build
npm run build

# Start production server
npm start
```
