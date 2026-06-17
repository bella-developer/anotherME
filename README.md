# anotherME

**a safe place for unique life**

Anonymous, dark-themed, circle-based social platform. Built for security, privacy, and performance on free-tier infrastructure.

## Overview

anotherME enables anonymous social interaction through randomized aliases and zero PII storage. Users create multi-paragraph posts within topic-specific circles, engage through nested comments, and react to content—all while maintaining complete anonymity.

**Core Principles:**
- Anonymous by enforcement (no PII, randomized aliases, no enumeration)
- Security by default (zero trust, fail closed, validate everything)
- Stateless architecture (fast cold starts, horizontal scaling)
- Performance first (indexed queries, cursor pagination, aggressive caching)

## Features

- Anonymous registration with auto-generated aliases
- JWT authentication (access + refresh tokens)
- Circle-based communities for organized discussions
- Multi-paragraph posts with category tagging
- Nested comments (max depth 3)
- Atomic reaction counters
- Dark theme with purple accents
- Fully responsive design
- Optimized for free-tier infrastructure

## Architecture

### Technology Stack

**Frontend**
- React 18 with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Axios for API communication
- Deployed on Vercel

**Backend**
- Node.js with Express
- JWT for authentication
- MongoDB with Mongoose ODM
- Helmet for security headers
- express-rate-limit for abuse prevention
- Deployed on Render

**Database**
- MongoDB Atlas (M0 Free Tier)
- Indexed collections for performance
- Cursor-based pagination

### Project Structure

```
anotherME/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # MongoDB schemas
│   │   ├── middlewares/      # Auth, validation, rate limiting
│   │   ├── utils/            # Helper functions
│   │   └── config/           # Configuration
│   └── server.js             # Entry point
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level pages
│   │   ├── features/         # Redux slices
│   │   ├── services/         # API client
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Helper functions
│   └── index.html            # Entry HTML
└── .kiro/            # Kiro specs and configuration
```

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/anotherME.git
cd anotherME
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and configure:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_ACCESS_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# - JWT_REFRESH_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# - CORS_ORIGIN: Your frontend URL (http://localhost:5173 for development)

# Start development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and configure:
# - VITE_API_BASE_URL: Your backend URL (http://localhost:5000/api for development)

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Server port | Yes | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_ACCESS_SECRET` | Access token secret (64 chars) | Yes | - |
| `JWT_REFRESH_SECRET` | Refresh token secret (64 chars) | Yes | - |
| `JWT_ACCESS_EXPIRY` | Access token TTL | No | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL | No | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | Yes | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | No | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | `100` |

See `backend/.env.example` for complete list with descriptions.

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | - |
| `VITE_APP_NAME` | Application name | No | `anotherME` |
| `VITE_MAX_POST_LENGTH` | Max post length | No | `5000` |
| `VITE_MAX_COMMENT_LENGTH` | Max comment length | No | `1000` |

See `frontend/.env.example` for complete list with descriptions.

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register    # Anonymous registration
POST   /api/auth/refresh     # Refresh access token
POST   /api/auth/logout      # Invalidate tokens
```

### Users

```
GET    /api/users/me         # Get current user profile
PATCH  /api/users/me         # Update demographics
```

### Posts

```
POST   /api/posts            # Create post
GET    /api/posts            # List posts (paginated)
GET    /api/posts/:id        # Get single post
PATCH  /api/posts/:id        # Update own post
DELETE /api/posts/:id        # Delete own post
POST   /api/posts/:id/reactions    # Add reaction
DELETE /api/posts/:id/reactions    # Remove reaction
```

### Circles

```
POST   /api/circles          # Create circle
GET    /api/circles          # List circles (paginated)
GET    /api/circles/:id      # Get circle details
GET    /api/circles/:id/posts      # Get posts in circle
DELETE /api/circles/:id/posts/:postId  # Moderate post
```

### Comments

```
POST   /api/posts/:postId/comments           # Create comment
GET    /api/posts/:postId/comments           # List comments
POST   /api/comments/:commentId/replies      # Create reply
DELETE /api/comments/:id                     # Delete comment
```

### Categories

```
GET    /api/categories             # List categories
GET    /api/categories/:name/posts # Get posts by category
```

### Health

```
GET    /api/health           # Health check endpoint
```

## 🚢 Deployment

> **📘 Complete deployment guide available in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

### Quick Deployment Overview

**Frontend**: Deploy to Vercel (Auto-deploys from GitHub)
**Backend**: Deploy to Render (Auto-deploys from GitHub)
**Keep-Alive**: GitHub Actions pings server every 10 minutes

### Prerequisites for Deployment

- GitHub repository (✅ you already have this)
- [Vercel Account](https://vercel.com) (Free)
- [Render Account](https://render.com) (Free)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 Cluster)
- [Cloudinary Account](https://cloudinary.com) (Free tier for images)

### Deployment Steps

1. **Generate Secrets**:
   ```bash
   node scripts/generate-secrets.js
   ```
   Save the output for environment variables.

2. **Deploy Backend to Render**:
   - Connect GitHub repo
   - Set root directory: `backend`
   - Add environment variables from generated secrets
   - Deploy automatically via `render.yaml`

3. **Deploy Frontend to Vercel**:
   - Connect GitHub repo
   - Set root directory: `frontend`
   - Add `VITE_API_BASE_URL` environment variable
   - Deploy automatically via `vercel.json`

4. **Setup GitHub Actions**:
   - Add `RENDER_BACKEND_URL` to GitHub Secrets
   - Enable workflows in Actions tab
   - Keep-alive workflow runs every 10 minutes

**📖 See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.**

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                  (bella-developer/anotherME)             │
└─────┬──────────────────────────────────┬────────────────┘
      │                                  │
      │ Auto-deploy on push              │ Auto-deploy on push
      ▼                                  ▼
┌─────────────────┐              ┌──────────────────┐
│  Vercel (Free)  │              │  Render (Free)   │
│   Frontend      │◄────CORS─────┤    Backend       │
│   React + Vite  │              │  Node + Express  │
└─────────────────┘              └────────┬─────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │ MongoDB Atlas   │
                                 │  (Free M0)      │
                                 └─────────────────┘
         ┌────────────────────────────┐
         │   GitHub Actions           │
         │   (Keep Server Awake)      │
         │   Pings every 10 minutes   │
         └────────────────────────────┘
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🔒 Security Features

- **Zero PII Storage**: No email, phone, or real names stored
- **JWT Authentication**: Secure token-based auth with rotation
- **Input Validation**: Comprehensive schema validation on all requests
- **HTML Sanitization**: XSS prevention on user-generated content
- **Rate Limiting**: Per-IP and per-token rate limits
- **CORS Protection**: Strict origin validation
- **Security Headers**: Helmet middleware with CSP, HSTS, etc.
- **Token Versioning**: Global token invalidation capability
- **Atomic Operations**: Race condition prevention on counters

## 📊 Performance Optimizations

- **Cursor Pagination**: Efficient pagination without offset queries
- **Database Indexes**: All queries use indexed fields
- **Connection Pooling**: Reused MongoDB connections
- **Response Caching**: Aggressive caching for feeds and static data
- **Lazy Loading**: Route-based code splitting
- **Memoization**: Optimized React component rendering
- **CDN Delivery**: Static assets served via Vercel CDN

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure:
- Code follows existing style conventions
- All tests pass
- Security best practices are maintained
- Documentation is updated

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with security and privacy as core principles
- Designed for free-tier infrastructure constraints
- Inspired by the need for truly anonymous social platforms

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `.kiro/specs/`

---

**anotherME** - a safe place for unique life 🌟
