import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { Admin } from '../models/Admin.js'
import { AppError } from './errorHandler.js'

export function signToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  )
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) throw new AppError('Authentication required', 401)

    const payload = jwt.verify(token, env.jwtSecret)
    const admin = await Admin.findById(payload.sub).select('-passwordHash')
    if (!admin || !admin.isActive) throw new AppError('Invalid or inactive account', 401)

    req.admin = admin
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401))
    }
    return next(error)
  }
}
