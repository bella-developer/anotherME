# anotherME Backend

Backend API built with Node.js, Express, and MongoDB.

## Requirements

* Node.js 18+
* npm 9+
* MongoDB Atlas

## Setup

```bash
npm install
cp .env.example .env
```

Configure `.env`:

```env
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:5173
```

Generate JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

API runs at:

```
http://localhost:5000
```

## Scripts

```bash
npm run dev      # Development server
npm start        # Production server
npm test         # Run tests
npm run lint     # Lint code
npm run format   # Format code
```

## Project Structure

```text
src/
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── utils/
├── config/
└── app.js

server.js
```

## Main Features

* JWT authentication
* Anonymous user profiles
* Posts, comments, and circles
* Content reactions
* Input validation
* Rate limiting
* Security headers
* MongoDB persistence

## API

Base URL:

```text
/api
```

Core resources:

```text
/auth
/users
/posts
/comments
/circles
/categories
/health
```

## Deployment

1. Set environment variables.
2. Build and deploy to your hosting platform.
3. Ensure MongoDB Atlas is accessible.
4. Set `NODE_ENV=production`.

Required production variables:

```env
NODE_ENV=production
MONGODB_URI=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGIN=https://your-frontend-url.com
```
