import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const required = ['MONGODB_URI', 'JWT_SECRET']

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@imperialco.biz',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123456',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  /** Shared secret for midnight product sync (Render cron / external scheduler). */
  cronSecret: process.env.CRON_SECRET || '',
  /** Field Mapping spreadsheet: https://docs.google.com/spreadsheets/d/<id>/edit */
  googleSheetsSpreadsheetId:
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
    '1NmrVWn6pWnKDHInWa0dCELFkb1FYMVBobPNPMdGZerM',
  googleSheetsRange: process.env.GOOGLE_SHEETS_RANGE || 'items!A1:Z',
  googleSheetsGid: process.env.GOOGLE_SHEETS_GID || '924637876',
  /** Full service-account JSON as a single-line string (preferred for private sheets). */
  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '',
  /** Preferred: Resend API key (https://resend.com/api-keys) */
  resendApiKey: process.env.RESEND_API_KEY || process.env.SMTP_PASS || '',
  /** Optional SMTP fallback for RFQ acknowledgement emails */
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  mailFrom: process.env.MAIL_FROM || process.env.SMTP_FROM || '',
  /** Internal inbox that receives full RFQ details on every submission */
  mailNotifyTo:
    process.env.MAIL_NOTIFY_TO ||
    process.env.NOTIFY_EMAIL ||
    'cs@imperialco.biz',
}
