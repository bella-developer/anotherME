# anotherME Backend

Express + Node.js backend API for the anotherME anonymous social platform.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📋 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (M0 Free Tier)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following:

**Required:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` - 64-character random string for access tokens
- `JWT_REFRESH_SECRET` - 64-character random string for refresh tokens (different from access)
- `CORS_ORIGIN` - Allowed frontend origin

**Optional:**
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- Rate limiting, cache, and content configuration

### Generate JWT Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice to generate two different secrets for access and refresh tokens.

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/           # API endpoint definitions and middleware wiring
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── circle.routes.js
│   │   ├── comment.routes.js
│   │   └── category.routes.js
│   │
│   ├── controllers/      # HTTP request/response handling (no business logic)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── circle.controller.js
│   │   ├── comment.controller.js
│   │   └── category.controller.js
│   │
│   ├── services/         # Business logic layer
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── post.service.js
│   │   ├── circle.service.js
│   │   ├── comment.service.js
│   │   └── category.service.js
│   │
│   ├── models/           # MongoDB schemas and indexes
│   │   ├── User.model.js
│   │   ├── Post.model.js
│   │   ├── Circle.model.js
│   │   └── Comment.model.js
│   │
│   ├── middlewares/      # Cross-cutting concerns
│   │   ├── auth.middleware.js        # JWT validation
│   │   ├── validation.middleware.js  # Input validation
│   │   ├── rateLimit.middleware.js   # Rate limiting
│   │   ├── security.middleware.js    # Security headers
│   │   ├── cache.middleware.js       # Response caching
│   │   └── errorHandler.middleware.js # Global error handling
│   │
│   ├── utils/            # Helper functions
│   │   ├── token.utils.js           # JWT generation/validation
│   │   ├── alias.utils.js           # Random alias generation
│   │   ├── sanitization.utils.js    # HTML sanitization
│   │   ├── response.utils.js        # Response formatting
│   │   └── logger.utils.js          # Structured logging
│   │
│   ├── config/           # Configuration management
│   │   └── database.js              # MongoDB connection
│   │
│   └── app.js            # Express app setup
│
├── scripts/              # Utility scripts
│   ├── cleanup-indexes.js
│   └── cleanup-test-data.js
│
├── server.js             # Entry point
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with auto-reload using nodemon.

### Production

```bash
npm start
```
Starts the production server.

### Testing

```bash
npm test
```
Runs all tests.

```bash
npm run test:watch
```
Runs tests in watch mode.

### Code Quality

```bash
npm run lint
```
Lints code using ESLint.

```bash
npm run format
```
Formats code using Prettier.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Anonymous registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate tokens

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user demographics

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - List posts (paginated)
- `GET /api/posts/:id` - Get single post
- `PATCH /api/posts/:id` - Update own post
- `DELETE /api/posts/:id` - Delete own post
- `POST /api/posts/:id/reactions` - Add reaction
- `DELETE /api/posts/:id/reactions` - Remove reaction

### Circles
- `POST /api/circles` - Create circle
- `GET /api/circles` - List circles (paginated)
- `GET /api/circles/:id` - Get circle details
- `GET /api/circles/:id/posts` - Get posts in circle
- `DELETE /api/circles/:id/posts/:postId` - Moderate post (creator only)

### Comments
- `POST /api/posts/:postId/comments` - Create comment
- `GET /api/posts/:postId/comments` - List comments (paginated)
- `POST /api/comments/:commentId/replies` - Create reply
- `DELETE /api/comments/:id` - Delete own comment

### Categories
- `GET /api/categories` - List available categories
- `GET /api/categories/:name/posts` - Get posts by category (paginated)

### Health
- `GET /api/health` - Health check endpoint

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Token versioning for global invalidation
- Automatic token rotation on refresh
- Ownership verification for modifications

### Input Validation & Sanitization
- Schema validation on all requests using express-validator
- HTML sanitization to prevent XSS attacks
- Content length enforcement
- Type coercion disabled

### Rate Limiting
- Per-IP rate limiting for unauthenticated requests
- Per-token rate limiting for authenticated requests
- Tiered limits: read (100/15min), write (30/15min), sensitive (10/15min)
- Sliding window algorithm

### Security Headers
- Helmet middleware for secure headers
- Strict Content Security Policy
- HSTS enabled
- CORS with origin whitelist

### Data Privacy
- No PII storage (no email, phone, real names)
- Randomized aliases
- Internal IDs never exposed in responses
- Opaque cursor tokens for pagination

## 📊 Performance Optimizations

### Database
- All queries use indexed fields
- Cursor-based pagination (no offset queries)
- Connection pooling with reuse
- TTL indexes for automatic cleanup

### Caching
- Aggressive caching for feeds and static data
- Cache headers on responses
- In-memory cache for rate limiting

### Architecture
- Stateless design for horizontal scaling
- Fast cold start optimization
- Graceful shutdown handling

## 🚢 Deployment

### Render (Free Tier)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Render will detect `render.yaml` automatically
5. Set environment variables in dashboard
6. Deploy!

**Note:** Free tier spins down after 15 minutes of inactivity.

### Environment Variables for Production

Set these in Render Dashboard:
- `NODE_ENV=production`
- `MONGODB_URI` (your MongoDB Atlas connection string)
- `JWT_ACCESS_SECRET` (64-char random string)
- `JWT_REFRESH_SECRET` (64-char random string)
- `CORS_ORIGIN` (your Vercel frontend URL)

## 🧪 Testing

Tests are located alongside source files with `.test.js` suffix.

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npm test -- auth.service.test.js
```

### Test Coverage
```bash
npm run test:coverage
```

## 📝 Logging

Structured JSON logging with Winston:
- Request/response logging
- Error logging with stack traces (dev only)
- Authentication events
- Rate limit violations
- Security events

**Never logged:**
- Tokens
- Passwords
- PII

## 🐛 Debugging

### Enable Debug Logs
```bash
NODE_ENV=development npm run dev
```

### View Request Logs
All requests are logged with:
- Request ID (for correlation)
- Method and path
- User ID (if authenticated)
- Response time
- Status code

## 🤝 Contributing

1. Follow existing code structure
2. Maintain layer separation (routes → controllers → services → models)
3. Add tests for new features
4. Update documentation
5. Follow security best practices

## 📚 Additional Documentation

- API specification: See main README.md
- Security implementation: `SECURITY_IMPLEMENTATION.md`
- Implementation summary: `IMPLEMENTATION_SUMMARY.md`
- Deployment guide: `render.yaml`

---

Built with security, privacy, and performance as core principles.
