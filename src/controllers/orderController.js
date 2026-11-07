import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'
import { generateOrderNumber } from '../utils/orderNumber.js'
import { uploadsDir } from '../middleware/upload.js'

function serializeOrder(order) {
  const data = order.toObject ? order.toObject() : { ...order }
  return {
    ...data,
    hasAttachment: Boolean(data.attachmentPath),
    attachmentUrl: data.attachmentPath
      ? `/api/orders/${data._id}/attachment`
      : null,
  }
}

const rfqProductSchema = z.object({
  id: z.string().optional(),
  itemId: z.string().optional(),
  name: z.string().optional(),
  itemName: z.string().optional(),
  manufacturer: z.string().optional(),
  country: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  drugForm: z.string().optional(),
  dosageForm: z.string().optional(),
  therapeuticClass: z.string().optional(),
  brandName: z.string().optional(),
  generic: z.string().optional(),
  strength: z.string().optional(),
  packSize: z.string().optional(),
})

const createOrderSchema = z.object({
  source: z.enum(['rfq', 'quote-modal']).optional().default('rfq'),
  customProduct: z.string().optional().default(''),
  packs: z.string().optional().default(''),
  originPreference: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  intendedUse: z.string().optional().default(''),
  targetMarket: z.string().optional().default(''),
  requiredBy: z.string().optional().nullable(),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  company: z.string().trim().min(1, 'Company is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  country: z.string().trim().min(1, 'Country is required'),
  products: z.array(rfqProductSchema).optional().default([]),
  product: z.string().optional(),
  message: z.string().optional(),
  name: z.string().optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['new', 'reviewing', 'quoted', 'closed', 'cancelled']).optional(),
  adminNotes: z.string().optional(),
})

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function resolveProducts(inputProducts = []) {
  const resolved = []

  for (const item of inputProducts) {
    let productDoc = null
    if (item.id) {
      productDoc = await Product.findById(item.id).catch(() => null)
    }
    if (!productDoc && item.itemId) {
      productDoc = await Product.findOne({ itemId: item.itemId })
    }

    resolved.push({
      productId: productDoc?._id,
      itemId: productDoc?.itemId || item.itemId || '',
      itemName: productDoc?.itemName || item.itemName || item.name || 'Unknown product',
      manufacturer: productDoc?.manufacturer || item.manufacturer || '',
      countryOfOrigin:
        productDoc?.countryOfOrigin || item.countryOfOrigin || item.country || '',
      dosageForm: productDoc?.dosageForm || item.dosageForm || item.drugForm || '',
      therapeuticClass: productDoc?.therapeuticClass || item.therapeuticClass || '',
      brandName: productDoc?.brandName || item.brandName || '',
      generic: productDoc?.generic || item.generic || '',
      strength: productDoc?.strength || item.strength || '',
      packSize: productDoc?.packSize || item.packSize || '',
    })
  }

  return resolved
}

function normalizeOrderBody(raw = {}) {
  const body = { ...raw }
  if (typeof body.products === 'string') {
    try {
      body.products = JSON.parse(body.products)
    } catch {
      body.products = []
    }
  }
  return body
}

export async function createOrder(req, res, next) {
  try {
    const body = createOrderSchema.parse(normalizeOrderBody(req.body))

    let products = await resolveProducts(body.products)
    let customProduct = body.customProduct
    let notes = body.notes
    let firstName = body.firstName
    let lastName = body.lastName

    if (body.source === 'quote-modal') {
      const fullName = (body.name || `${body.firstName} ${body.lastName}`).trim()
      const [first, ...rest] = fullName.split(/\s+/)
      firstName = first || body.firstName
      lastName = rest.join(' ') || body.lastName
      customProduct = body.product || body.customProduct || ''
      notes = body.message || body.notes || ''
    }

    if (!products.length && !customProduct.trim()) {
      throw new AppError('Add at least one catalog product or a custom product', 400)
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      source: body.source,
      products,
      customProduct,
      packs: body.packs,
      originPreference: body.originPreference,
      notes,
      intendedUse: body.intendedUse,
      targetMarket: body.targetMarket,
      requiredBy: body.requiredBy ? new Date(body.requiredBy) : undefined,
      firstName,
      lastName,
      company: body.company,
      jobTitle: body.jobTitle,
      email: body.email,
      phone: body.phone,
      country: body.country,
      attachmentName: req.file?.originalname || '',
      attachmentPath: req.file?.filename || '',
    })

    res.status(201).json({
      success: true,
      data: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid order data', 400, error.flatten()))
    }
    next(error)
  }
}

export async function listOrders(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
    const filter = {}

    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status
    if (req.query.source && req.query.source !== 'all') filter.source = req.query.source
    if (req.query.country && req.query.country !== 'all') {
      filter.country = new RegExp(escapeRegex(req.query.country), 'i')
    }
    if (req.query.q) {
      const q = escapeRegex(String(req.query.q).trim())
      filter.$or = [
        { orderNumber: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { company: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { customProduct: new RegExp(q, 'i') },
        { 'products.itemName': new RegExp(q, 'i') },
      ]
    }

    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: {
        items: items.map(serializeOrder),
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

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, data: serializeOrder(order) })
  } catch (error) {
    next(error)
  }
}

export async function downloadOrderAttachment(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) throw new AppError('Order not found', 404)
    if (!order.attachmentPath) throw new AppError('No attachment on this order', 404)

    const filePath = path.join(uploadsDir, order.attachmentPath)
    if (!fs.existsSync(filePath)) {
      throw new AppError('Attachment file is missing on server', 404)
    }

    res.download(filePath, order.attachmentName || order.attachmentPath)
  } catch (error) {
    next(error)
  }
}

export async function updateOrder(req, res, next) {
  try {
    const body = updateStatusSchema.parse(req.body)
    const order = await Order.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, data: serializeOrder(order) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid update payload', 400, error.flatten()))
    }
    next(error)
  }
}

export async function getDashboardStats(_req, res, next) {
  try {
    const [productCount, orderCount, newOrders, quotedOrders, recentOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: 'new' }),
        Order.countDocuments({ status: 'quoted' }),
        Order.find().sort({ createdAt: -1 }).limit(8),
      ])

    res.json({
      success: true,
      data: {
        productCount,
        orderCount,
        newOrders,
        quotedOrders,
        recentOrders: recentOrders.map(serializeOrder),
      },
    })
  } catch (error) {
    next(error)
  }
}
