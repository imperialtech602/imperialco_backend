import { z } from 'zod'
import { Product } from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'
import {
  parseProductWorkbook,
  buildProductTemplateBuffer,
} from '../utils/excelImport.js'

const productFields = {
  itemId: z.string().trim().min(1),
  itemName: z.string().trim().min(1),
  itemType: z.string().trim().optional().default('inventory'),
  status: z.enum(['active', 'inactive', 'discontinued']).optional().default('active'),
  salesDescription: z.string().optional().default(''),
  salesRate: z.coerce.number().optional().default(0),
  purchaseDescription: z.string().optional().default(''),
  purchaseRate: z.coerce.number().optional().default(0),
  brandName: z.string().optional().default(''),
  generic: z.string().optional().default(''),
  strength: z.string().optional().default(''),
  packSize: z.string().optional().default(''),
  dosageForm: z.string().optional().default(''),
  countryOfOrigin: z.string().optional().default(''),
  sourceCode: z.string().optional().default(''),
  therapeuticClass: z.string().optional().default(''),
  manufacturer: z.string().optional().default(''),
}

const createSchema = z.object(productFields)
const updateSchema = z.object(productFields).partial()

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function uniqueCaseInsensitive(values = []) {
  const seen = new Set()
  const result = []
  for (const value of values) {
    const raw = String(value ?? '').trim()
    if (!raw) continue
    const key = raw.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(raw)
  }
  return result
}

function buildProductFilter(query) {
  const filter = {}

  if (query.status && query.status !== 'all') filter.status = query.status
  if (query.itemType && query.itemType !== 'all') filter.itemType = query.itemType
  if (query.countryOfOrigin && query.countryOfOrigin !== 'all') {
    filter.countryOfOrigin = new RegExp(`^${escapeRegex(query.countryOfOrigin)}$`, 'i')
  }
  if (query.dosageForm && query.dosageForm !== 'all') {
    filter.dosageForm = new RegExp(escapeRegex(query.dosageForm), 'i')
  }
  if (query.therapeuticClass && query.therapeuticClass !== 'all') {
    filter.therapeuticClass = new RegExp(escapeRegex(query.therapeuticClass), 'i')
  }
  if (query.manufacturer && query.manufacturer !== 'all') {
    filter.manufacturer = new RegExp(escapeRegex(query.manufacturer), 'i')
  }
  if (query.sourceCode && query.sourceCode !== 'all') {
    filter.sourceCode = new RegExp(`^${escapeRegex(query.sourceCode)}$`, 'i')
  }
  if (query.brandName) {
    filter.brandName = new RegExp(escapeRegex(query.brandName), 'i')
  }
  if (query.generic) {
    filter.generic = new RegExp(escapeRegex(query.generic), 'i')
  }

  if (query.q) {
    const q = escapeRegex(String(query.q).trim())
    filter.$or = [
      { itemName: new RegExp(q, 'i') },
      { itemId: new RegExp(q, 'i') },
      { brandName: new RegExp(q, 'i') },
      { generic: new RegExp(q, 'i') },
      { manufacturer: new RegExp(q, 'i') },
      { therapeuticClass: new RegExp(q, 'i') },
      { salesDescription: new RegExp(q, 'i') },
      { sourceCode: new RegExp(q, 'i') },
    ]
  }

  return filter
}

/** Safe fields for public catalog — never expose pricing/cost. */
export function toPublicProduct(doc) {
  const p = doc.toObject ? doc.toObject() : doc
  return {
    id: p._id?.toString?.() || p.id,
    itemId: p.itemId,
    name: p.itemName,
    itemName: p.itemName,
    itemType: p.itemType,
    status: p.status,
    manufacturer: p.manufacturer,
    therapeuticClass: p.therapeuticClass,
    country: p.countryOfOrigin,
    countryOfOrigin: p.countryOfOrigin,
    drugForm: p.dosageForm,
    dosageForm: p.dosageForm,
    brandName: p.brandName,
    generic: p.generic,
    strength: p.strength,
    packSize: p.packSize,
    sourceCode: p.sourceCode,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

/** Full product for authenticated admin only. */
export function toAdminProduct(doc) {
  const p = doc.toObject ? doc.toObject() : doc
  return {
    ...toPublicProduct(doc),
    salesDescription: p.salesDescription,
    salesRate: p.salesRate,
    purchaseDescription: p.purchaseDescription,
    purchaseRate: p.purchaseRate,
  }
}

export async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
    const sortBy = req.query.sortBy || 'createdAt'
    const sortDir = req.query.sortDir === 'asc' ? 1 : -1
    const filter = buildProductFilter(req.query)

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortBy]: sortDir })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: {
        items: items.map(toAdminProduct),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function listCatalog(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12))
    const filter = buildProductFilter({ ...req.query, status: 'active' })

    const [items, total, countries, forms] = await Promise.all([
      Product.find(filter)
        .select(
          '-salesRate -purchaseRate -purchaseDescription -salesDescription -__v',
        )
        .sort({ itemName: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
      Product.distinct('countryOfOrigin', { status: 'active' }),
      Product.distinct('dosageForm', { status: 'active' }),
    ])

    res.json({
      success: true,
      data: {
        items: items.map(toPublicProduct),
        filters: {
          countries: uniqueCaseInsensitive(countries).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' }),
          ),
          dosageForms: uniqueCaseInsensitive(forms).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' }),
          ),
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) throw new AppError('Product not found', 404)
    res.json({ success: true, data: toAdminProduct(product) })
  } catch (error) {
    next(error)
  }
}

export async function createProduct(req, res, next) {
  try {
    const body = createSchema.parse(req.body)
    const existing = await Product.findOne({ itemId: body.itemId })
    if (existing) throw new AppError('A product with this item id already exists', 409)

    const product = await Product.create(body)
    res.status(201).json({ success: true, data: toAdminProduct(product) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid product data', 400, error.flatten()))
    }
    next(error)
  }
}

export async function updateProduct(req, res, next) {
  try {
    const body = updateSchema.parse(req.body)
    if (body.itemId) {
      const clash = await Product.findOne({
        itemId: body.itemId,
        _id: { $ne: req.params.id },
      })
      if (clash) throw new AppError('A product with this item id already exists', 409)
    }

    const product = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!product) throw new AppError('Product not found', 404)
    res.json({ success: true, data: toAdminProduct(product) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid product data', 400, error.flatten()))
    }
    next(error)
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) throw new AppError('Product not found', 404)
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
}

export async function importProducts(req, res, next) {
  try {
    if (!req.file) throw new AppError('Excel file is required', 400)

    const { rows, errors } = parseProductWorkbook(req.file.buffer)
    if (!rows.length) {
      throw new AppError('No valid product rows found in file', 400, errors)
    }

    let created = 0
    let updated = 0
    const rowErrors = [...errors]

    for (const row of rows) {
      try {
        const existing = await Product.findOne({ itemId: row.itemId })
        if (existing) {
          Object.assign(existing, row)
          await existing.save()
          updated += 1
        } else {
          await Product.create(row)
          created += 1
        }
      } catch (err) {
        rowErrors.push(`${row.itemId}: ${err.message}`)
      }
    }

    res.json({
      success: true,
      data: {
        created,
        updated,
        total: rows.length,
        errors: rowErrors,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function downloadTemplate(_req, res, next) {
  try {
    const buffer = buildProductTemplateBuffer()
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="imperial-products-template.xlsx"',
    )
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

export async function getProductMeta(_req, res, next) {
  try {
    const [statuses, itemTypes, countries, dosageForms, classes, manufacturers, sources] =
      await Promise.all([
        Product.distinct('status'),
        Product.distinct('itemType'),
        Product.distinct('countryOfOrigin'),
        Product.distinct('dosageForm'),
        Product.distinct('therapeuticClass'),
        Product.distinct('manufacturer'),
        Product.distinct('sourceCode'),
      ])

    res.json({
      success: true,
      data: {
        statuses: uniqueCaseInsensitive(statuses),
        itemTypes: uniqueCaseInsensitive(itemTypes),
        countries: uniqueCaseInsensitive(countries).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }),
        ),
        dosageForms: uniqueCaseInsensitive(dosageForms).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }),
        ),
        therapeuticClasses: uniqueCaseInsensitive(classes).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }),
        ),
        manufacturers: uniqueCaseInsensitive(manufacturers).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }),
        ),
        sourceCodes: uniqueCaseInsensitive(sources).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }),
        ),
      },
    })
  } catch (error) {
    next(error)
  }
}
