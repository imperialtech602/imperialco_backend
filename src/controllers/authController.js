import { z } from 'zod'
import { Admin } from '../models/Admin.js'
import { signToken } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(req, res, next) {
  try {
    const body = loginSchema.parse(req.body)
    const admin = await Admin.findOne({ email: body.email.toLowerCase() })
    if (!admin || !admin.isActive) throw new AppError('Invalid email or password', 401)

    const ok = await admin.comparePassword(body.password)
    if (!ok) throw new AppError('Invalid email or password', 401)

    const token = signToken(admin)
    res.json({
      success: true,
      data: {
        token,
        admin: admin.toSafeJSON(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid login payload', 400, error.flatten()))
    }
    next(error)
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    data: req.admin.toSafeJSON(),
  })
}
