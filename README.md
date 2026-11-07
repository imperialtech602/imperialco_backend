# Imperial Co Backend

Node.js / Express API for Imperial Co product catalog, RFQ orders, and admin.

## Stack

- Express 5
- MongoDB + Mongoose
- JWT auth
- Multer uploads
- Excel import (xlsx)

## Setup

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

API defaults to `http://localhost:5000`.

## Env

Copy `.env.example` and set:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `CLIENT_ORIGIN` (frontend URL)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start API with watch |
| `npm start` | Start API |
| `npm run seed` | Ensure admin user exists |
