import { google } from 'googleapis'
import { env } from '../config/env.js'
import {
  matrixToObjectRows,
  normalizeProductRows,
  parseProductCsv,
} from './excelImport.js'

function parseServiceAccount() {
  const raw = env.googleServiceAccountJson
  if (!raw) return null
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON')
  }
}

async function fetchViaSheetsApi() {
  const credentials = parseServiceAccount()
  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is required for Sheets API mode')
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: env.googleSheetsSpreadsheetId,
    range: env.googleSheetsRange,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  })

  const values = response.data.values || []
  const rawRows = matrixToObjectRows(values)
  return normalizeProductRows(rawRows)
}

async function fetchViaCsvExport() {
  const id = env.googleSheetsSpreadsheetId
  const gid = env.googleSheetsGid
  const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`

  const response = await fetch(url, {
    redirect: 'follow',
    headers: { Accept: 'text/csv' },
  })

  if (!response.ok) {
    throw new Error(
      `Google Sheets CSV export failed (${response.status}). Share the sheet with “Anyone with the link” (Viewer) or configure a service account.`,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()
  if (contentType.includes('text/html') || text.trimStart().startsWith('<!')) {
    throw new Error(
      'Google Sheets CSV export returned HTML. Share the spreadsheet publicly (Viewer) or use GOOGLE_SERVICE_ACCOUNT_JSON.',
    )
  }

  return parseProductCsv(text)
}

/**
 * Pull product rows from the configured Google Sheet.
 * Prefers Sheets API when a service account is configured; otherwise CSV export.
 */
export async function fetchProductsFromGoogleSheet() {
  if (!env.googleSheetsSpreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured')
  }

  if (env.googleServiceAccountJson) {
    return fetchViaSheetsApi()
  }

  return fetchViaCsvExport()
}
