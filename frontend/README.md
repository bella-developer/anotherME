# anotherME Frontend

Frontend application built with React and Vite.

## Requirements

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Lint code
npm run format   # Format code
```

## Project Structure

```text
src/
├── components/   # Reusable UI components
├── pages/        # Application pages
├── features/     # Redux slices
├── services/     # API services
├── hooks/        # Custom hooks
├── store/        # Redux store
├── App.jsx
└── main.jsx
```

## Tech Stack

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Framer Motion

## Build & Deploy

```bash
npm run build
```

Production files are generated in the `dist/` directory.

Set the following environment variable in your deployment platform:

```env
VITE_API_BASE_URL=https://your-api-url/api
```
