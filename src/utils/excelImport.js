import * as XLSX from 'xlsx'

const HEADER_MAP = {
  'item id': 'itemId',
  itemid: 'itemId',
  'item name': 'itemName',
  itemname: 'itemName',
  'item type': 'itemType',
  itemtype: 'itemType',
  status: 'status',
  'sales description': 'salesDescription',
  salesdescription: 'salesDescription',
  'sales rate': 'salesRate',
  salesrate: 'salesRate',
  'purchase description': 'purchaseDescription',
  purchasedescription: 'purchaseDescription',
  'purchase rate': 'purchaseRate',
  purchaserate: 'purchaseRate',
  'brand name': 'brandName',
  brandname: 'brandName',
  brand: 'brandName',
  generic: 'generic',
  strength: 'strength',
  'pack size': 'packSize',
  packsize: 'packSize',
  'dosage form': 'dosageForm',
  dosageform: 'dosageForm',
  'country of origin': 'countryOfOrigin',
  countryoforigin: 'countryOfOrigin',
  country: 'countryOfOrigin',
  'source code': 'sourceCode',
  sourcecode: 'sourceCode',
  'therapeutic class': 'therapeuticClass',
  therapeuticclass: 'therapeuticClass',
  manufacturer: 'manufacturer',
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value
  const cleaned = String(value).replace(/[$,\s]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function toStatus(value) {
  const s = String(value || 'active').trim().toLowerCase()
  if (['inactive', 'discontinued', 'active'].includes(s)) return s
  return 'active'
}

export function parseProductWorkbook(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return { rows: [], errors: ['Workbook has no sheets'] }

  const sheet = workbook.Sheets[sheetName]
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false })
  const rows = []
  const errors = []

  rawRows.forEach((raw, index) => {
    const mapped = {}
    for (const [key, value] of Object.entries(raw)) {
      const field = HEADER_MAP[normalizeHeader(key)]
      if (field) mapped[field] = value
    }

    const itemId = String(mapped.itemId || '').trim()
    const itemName = String(mapped.itemName || '').trim()

    if (!itemId || !itemName) {
      errors.push(`Row ${index + 2}: item id and item name are required`)
      return
    }

    rows.push({
      itemId,
      itemName,
      itemType: String(mapped.itemType || 'inventory').trim() || 'inventory',
      status: toStatus(mapped.status),
      salesDescription: String(mapped.salesDescription || '').trim(),
      salesRate: toNumber(mapped.salesRate),
      purchaseDescription: String(mapped.purchaseDescription || '').trim(),
      purchaseRate: toNumber(mapped.purchaseRate),
      brandName: String(mapped.brandName || '').trim(),
      generic: String(mapped.generic || '').trim(),
      strength: String(mapped.strength || '').trim(),
      packSize: String(mapped.packSize || '').trim(),
      dosageForm: String(mapped.dosageForm || '').trim(),
      countryOfOrigin: String(mapped.countryOfOrigin || '').trim(),
      sourceCode: String(mapped.sourceCode || '').trim(),
      therapeuticClass: String(mapped.therapeuticClass || '').trim(),
      manufacturer: String(mapped.manufacturer || '').trim(),
    })
  })

  return { rows, errors }
}

export function buildProductTemplateBuffer() {
  const headers = [
    'item id',
    'item name',
    'item type',
    'status',
    'sales description',
    'sales rate',
    'purchase description',
    'purchase rate',
    'brand name',
    'generic',
    'strength',
    'pack size',
    'dosage form',
    'country of origin',
    'source code',
    'therapeutic class',
    'manufacturer',
  ]

  const sample = [
    '4927790000013758026',
    "5-FU (FLUOROURACIL) 250MG/5ML 10'S INJECTION VIAL",
    'inventory',
    'active',
    'MANUFACTURER: KYOWA KIRIN CO.,LTD JAPAN',
    37800,
    '$30 from KOS @ 290',
    8700,
    'FU',
    'FLUOROURACIL',
    '250MG/5ML',
    "10'S",
    'INJECTION VIAL',
    'JAPAN',
    'KOS',
    'Antineoplastic agent',
    'KYOWA KIRIN CO.,LTD',
  ]

  const sheet = XLSX.utils.aoa_to_sheet([headers, sample])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Products')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
