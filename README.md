# Imperial Co Backend

Node.js / Express API for Imperial Co product catalog, RFQ orders, and admin.

## Stack

- Express 5
- MongoDB + Mongoose
- JWT auth
- Multer uploads
- Excel import (xlsx)
- Google Sheets product sync (midnight cron)

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
- `CRON_SECRET` — required for `/api/products/sync/sheets`
- `GOOGLE_SHEETS_SPREADSHEET_ID` / `GOOGLE_SHEETS_RANGE` / `GOOGLE_SHEETS_GID`
- `GOOGLE_SERVICE_ACCOUNT_JSON` — recommended for private sheets

## Product sync (Google Sheets)

Best approach for this stack: **backend pulls** the Field Mapping `items` tab and **upserts by `itemId`** (same as Excel import). Schedule that pull at midnight — do not rely on `IMPORTRANGE` alone.

| Endpoint | Auth | Purpose |
| --- | --- | --- |
| `POST /api/products/sync/sheets` | `x-cron-secret: <CRON_SECRET>` | Midnight / external cron |
| `POST /api/products/sync/sheets/manual` | Admin JWT + `products` permission | Admin “Sync now” |

**Sheet access**

1. Prefer a Google Cloud **service account** with Sheets API enabled; share the spreadsheet with that email (Viewer); set `GOOGLE_SERVICE_ACCOUNT_JSON`.
2. Or share the sheet as **Anyone with the link (Viewer)** so CSV export works without credentials.

**Midnight schedule**

- Render Cron in `render.yaml` runs at `0 19 * * *` UTC (= midnight Pakistan / UTC+5).
- Or any external cron (cron-job.org, etc.) hitting the sync URL with `x-cron-secret`.

Manual test:

```bash
curl -X POST http://localhost:5000/api/products/sync/sheets \
  -H "x-cron-secret: $CRON_SECRET"
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start API with watch |
| `npm start` | Start API |
| `npm run seed` | Ensure admin user exists |
