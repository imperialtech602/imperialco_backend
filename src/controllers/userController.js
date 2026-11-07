import { z } from 'zod'
import { Admin } from '../models/Admin.js'
import { AppError } from '../middleware/errorHandler.js'

const permissionsSchema = z.object({
  products: z.boolean().optional().default(false),
  orders: z.boolean().optional().default(false),
  knowledgeHub: z.boolean().optional().default(false),
})

const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'superadmin']).optional().default('admin'),
  permissions: permissionsSchema.optional(),
  isActive: z.boolean().optional().default(true),
})

const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['admin', 'superadmin']).optional(),
  permissions: permissionsSchema.optional(),
  isActive: z.boolean().optional(),
})

export async function listUsers(req, res, next) {
  try {
    const users = await Admin.find().sort({ createdAt: -1 }).select('-passwordHash')
    res.json({
      success: true,
      data: users.map((user) => user.toSafeJSON()),
    })
  } catch (error) {
    next(error)
  }
}

export async function createUser(req, res, next) {
  try {
    const body = createUserSchema.parse(req.body)
    const email = body.email.toLowerCase()
    const exists = await Admin.findOne({ email })
    if (exists) throw new AppError('A user with this email already exists', 409)

    const passwordHash = await Admin.hashPassword(body.password)
    const user = await Admin.create({
      name: body.name,
      email,
      passwordHash,
      role: body.role,
      permissions:
        body.role === 'superadmin'
          ? { products: true, orders: true, knowledgeHub: true }
          : {
              products: Boolean(body.permissions?.products),
              orders: Boolean(body.permissions?.orders),
              knowledgeHub: Boolean(body.permissions?.knowledgeHub),
            },
      isActive: body.isActive,
    })

    res.status(201).json({ success: true, data: user.toSafeJSON() })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid user data', 400, error.flatten()))
    }
    next(error)
  }
}

export async function updateUser(req, res, next) {
  try {
    const body = updateUserSchema.parse(req.body)
    const user = await Admin.findById(req.params.id)
    if (!user) throw new AppError('User not found', 404)

    if (body.email && body.email.toLowerCase() !== user.email) {
      const clash = await Admin.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: user._id },
      })
      if (clash) throw new AppError('A user with this email already exists', 409)
      user.email = body.email.toLowerCase()
    }

    if (body.name !== undefined) user.name = body.name
    if (body.role !== undefined) user.role = body.role
    if (body.isActive !== undefined) user.isActive = body.isActive
    if (body.password) user.passwordHash = await Admin.hashPassword(body.password)

    if (user.role === 'superadmin') {
      user.permissions = { products: true, orders: true, knowledgeHub: true }
    } else if (body.permissions) {
      user.permissions = {
        products: Boolean(body.permissions.products),
        orders: Boolean(body.permissions.orders),
        knowledgeHub: Boolean(body.permissions.knowledgeHub),
      }
    }

    // Prevent locking yourself out
    if (
      req.admin._id.toString() === user._id.toString() &&
      body.isActive === false
    ) {
      throw new AppError('You cannot deactivate your own account', 400)
    }

    await user.save()
    res.json({ success: true, data: user.toSafeJSON() })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid user data', 400, error.flatten()))
    }
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (req.admin._id.toString() === req.params.id) {
      throw new AppError('You cannot delete your own account', 400)
    }
    const user = await Admin.findByIdAndDelete(req.params.id)
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}
