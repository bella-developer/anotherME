# anotherME Frontend

React + Vite frontend application for the anotherME anonymous social platform.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your backend API URL
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📋 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

**Required:**
- `VITE_API_BASE_URL` - Backend API URL (e.g., `http://localhost:5000/api`)

**Optional:**
- `VITE_APP_NAME` - Application name (default: anotherME)
- `VITE_MAX_POST_LENGTH` - Maximum post length (default: 5000)
- `VITE_MAX_COMMENT_LENGTH` - Maximum comment length (default: 1000)
- Content limits, cache duration, and feature flags

See `.env.example` for complete list with descriptions.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── PostCard.jsx
│   │   ├── PostForm.jsx
│   │   ├── CircleCard.jsx
│   │   ├── CommentThread.jsx
│   │   ├── CommentForm.jsx
│   │   ├── Navbar.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Toast.jsx
│   │   ├── ToastContainer.jsx
│   │   ├── WelcomeModal.jsx
│   │   ├── PageTransition.jsx
│   │   ├── StaggerList.jsx
│   │   └── index.js
│   │
│   ├── pages/            # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Circles.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   │
│   ├── features/         # Redux Toolkit slices
│   │   ├── authSlice.js
│   │   ├── postsSlice.js
│   │   ├── circlesSlice.js
│   │   ├── commentsSlice.js
│   │   └── userSlice.js
│   │
│   ├── services/         # API client functions
│   │   ├── api.js              # Axios instance
│   │   ├── authService.js
│   │   ├── postService.js
│   │   ├── circleService.js
│   │   ├── commentService.js
│   │   └── userService.js
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── useIntersectionObserver.js
│   │   └── useReducedMotion.js
│   │
│   ├── utils/            # Helper functions
│   │   └── performance.js
│   │
│   ├── store/            # Redux store configuration
│   │   └── index.js
│   │
│   ├── App.jsx           # Root component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles (Tailwind)
│
├── public/               # Static assets
├── index.html            # Entry HTML
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── README.md             # This file
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).

### Production Build

```bash
npm run build
```
Builds the app for production to the `dist` folder.

### Preview Production Build

```bash
npm run preview
```
Locally preview the production build.

### Code Quality

```bash
npm run lint
```
Lints code using ESLint.

```bash
npm run format
```
Formats code using Prettier.

## 🎨 Tech Stack

### Core
- **React 18** - UI library with hooks and concurrent features
- **Vite** - Fast build tool with HMR
- **JavaScript (ES6+)** - Modern JavaScript

### State Management
- **Redux Toolkit** - Simplified Redux with built-in best practices
- **Redux Thunk** - Async action handling

### Routing
- **React Router v6** - Client-side routing with lazy loading

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Dark Theme** - Custom dark color palette with purple accents

### HTTP Client
- **Axios** - Promise-based HTTP client with interceptors

### Animations
- **Framer Motion** - Production-ready animation library
- **CSS Transitions** - Native CSS animations

## 🎨 Design System

### Color Palette

```css
/* Backgrounds */
--bg-primary: #0f0f0f
--bg-secondary: #1a1a1a
--bg-elevated: #252525

/* Text */
--text-primary: #ffffff
--text-secondary: #a3a3a3
--text-tertiary: #737373

/* Accents */
--accent-primary: #8b5cf6 (purple)
--accent-secondary: #3b82f6 (blue)

/* Borders */
--border-subtle: #2a2a2a

/* Status */
--success: #10b981
--error: #ef4444
--warning: #f59e0b
```

### Typography

- **Headings**: Bold, white (#ffffff)
- **Body**: Regular, 16px, 1.6 line height
- **Metadata**: 12-14px, gray (#a3a3a3)

### Components

All components follow the dark theme with:
- Rounded corners (8-12px border radius)
- Subtle shadows and glows
- Smooth transitions (200ms)
- Hover effects (brightness +10%, scale 1.02)
- Focus indicators (2px purple outline)

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (two columns)
- **Desktop**: > 1024px (three columns)

### Mobile Optimizations

- Touch-friendly targets (minimum 48px)
- Simplified layouts
- Reduced animations
- Optimized images
- Hamburger menu navigation

## ⚡ Performance Optimizations

### Code Splitting
- Lazy-loaded route components
- Dynamic imports for heavy components
- Separate vendor bundles

### React Optimizations
- Memoized components with `React.memo`
- Memoized callbacks with `useCallback`
- Memoized values with `useMemo`
- Virtualized lists for long feeds

### Asset Optimization
- Tailwind CSS purge (removes unused styles)
- Image lazy loading
- Font optimization
- Minified production builds

### Caching
- API response caching in Redux
- Service worker for offline support (optional)
- Browser caching with cache headers

## 🔒 Security Features

### Authentication
- JWT tokens stored securely (localStorage or sessionStorage)
- Automatic token refresh
- Token expiration handling
- Logout on token invalidation

### Input Validation
- Client-side validation before API calls
- Content length enforcement
- XSS prevention (React's built-in escaping)

### API Security
- HTTPS only in production
- CORS-compliant requests
- Defensive API response handling
- Error boundary for crash recovery

## 🚢 Deployment

### Vercel (Recommended)

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option 2: GitHub Integration

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set environment variables:
   - `VITE_API_BASE_URL` (your backend URL)
4. Deploy automatically on push

### Environment Variables for Production

Set in Vercel Dashboard:
- `VITE_API_BASE_URL` - Your Render backend URL (e.g., `https://your-app.onrender.com/api`)

### Build Configuration

Vercel will automatically detect Vite and use:
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🎯 Features

### Authentication
- Anonymous registration with auto-generated aliases
- JWT-based authentication
- Automatic token refresh
- Secure logout

### Posts
- Create multi-paragraph posts
- Category tagging
- Circle assignment
- Edit and delete own posts
- Reaction system (like, support, insightful)

### Circles
- Browse and search circles
- Create new circles
- Filter by popularity, recency
- Join circles

### Comments
- Nested comment threads (max depth 3)
- Reply to comments
- Delete own comments
- Real-time comment counts

### User Profile
- View activity stats
- Browse own posts and comments
- Update demographics (optional)

### UI/UX
- Dark theme throughout
- Smooth animations and transitions
- Infinite scroll for feeds
- Skeleton loaders
- Toast notifications
- Responsive design
- Accessibility features

## 🐛 Debugging

### Enable Debug Mode
Set in `.env`:
```
VITE_DEBUG_MODE=true
```

### View Redux State
Install Redux DevTools browser extension for state inspection.

### Network Debugging
Open browser DevTools → Network tab to inspect API calls.

## 🤝 Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain component modularity
4. Add PropTypes or TypeScript types
5. Follow Tailwind CSS conventions
6. Test responsive design
7. Ensure accessibility (ARIA labels, keyboard navigation)

## 📚 Additional Documentation

- Component documentation: `COMPONENTS_IMPLEMENTATION.md`
- Animation guide: `ANIMATIONS.md`
- Main project README: `../README.md`

---

Built with React, Vite, and Tailwind CSS for a fast, modern user experience.
