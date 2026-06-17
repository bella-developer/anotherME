# anotherME Backend

Backend API for anotherME.

## Requirements

* Node.js 18+
* MongoDB

## Setup

```bash
npm install
cp .env.example .env
```

Configure the required environment variables in `.env`.

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Default server:

```text
http://localhost:5000
```

## Scripts

```bash
npm run dev
npm start
npm test
npm run lint
```

## Structure

```text
src/
├── routes/
├── controllers/
├── services/
├── models/
└── middlewares/
```

## Features

* Authentication
* Anonymous profiles
* Posts and comments
* Communities
* Input validation
* Rate limiting

## Deployment

Set the required environment variables and start the server in production mode.

See `.env.example` for configuration.
