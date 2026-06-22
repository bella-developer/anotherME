# ESO

**Within · Inner · Essence**

A dark aesthetic social platform for introverts, deep thinkers, and solitary souls. Where silence speaks volumes and authenticity reigns.

## 🖤 Philosophy

Eso (meaning "within" or "inner") is a safe haven for those who prefer depth over superficiality. A space designed for:

- **Introverts** who need a quiet corner in the digital noise
- **Deep thinkers** who crave philosophical conversations
- **Solitary minds** who find beauty in being alone
- **Unique individuals** who feel misunderstood by mainstream social media

## ✨ Features

### Core Experience
- **Anonymous Identity** - Express yourself without social pressure
- **Dark Aesthetic** - Pure black & white monochrome design
- **Four Themed Rooms**
  - Philosophy: Question reality and explore ideas
  - Solitude: Embrace the beauty of being alone
  - Creativity: Share art, writing, and creative expression
  - Deep Talks: Conversations that go beneath the surface

### Technical Features
- End-to-end encrypted authentication
- Responsive design (mobile, tablet, desktop)
- Smooth scroll animations with Framer Motion
- Glassmorphic UI components
- Fast performance with code splitting
- SEO optimized with meta tags

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool for fast development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - Database
- **JWT** - Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB running locally or cloud instance

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your MongoDB URI and secrets in .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL
npm run dev
```

Visit `http://localhost:5173` to see Eso in action.

## 📁 Project Structure

```text
anotherME/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Images and static files
│   └── public/             # Public assets
├── backend/
│   └── src/
│       ├── routes/         # API routes
│       ├── models/         # Database models
│       ├── middleware/     # Express middleware
│       └── controllers/    # Route controllers
└── docs/                   # Documentation
```

## 🎨 Design System

- **Colors**: Pure black (#000000) and white (#FFFFFF) with subtle grays
- **Typography**: Monospace fonts (Geist Mono, Space Mono)
- **Aesthetic**: Dark, minimalist, glassmorphic elements
- **Animation**: Smooth fade-ins, slides, and hover effects

## 🔐 Security & Privacy

- Passwords hashed with bcrypt
- JWT-based authentication
- HTTPS enforced in production
- GDPR & CCPA compliant
- Optional email for account recovery
- No third-party tracking

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and code of conduct.

## 📄 License

MIT License - see LICENSE file for details

## 💬 Contact

- Email: hello@eso.app
- Support: support@eso.app

---

**"Most people seek attention. Few seek understanding."** — Eso Philosophy
