import { timingSafeEqual } from 'node:crypto'
import { env } from '../config/env.js'
import { AppError } from './errorHandler.js'

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''))
  const right = Buffer.from(String(b || ''))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/** Allow Render/external cron via `x-cron-secret` or `Authorization: Bearer <CRON_SECRET>`. */
export function requireCronSecret(req, _res, next) {
  if (!env.cronSecret) {
    return next(new AppError('CRON_SECRET is not configured on the server', 503))
  }

  const headerSecret = req.headers['x-cron-secret']
  const auth = req.headers.authorization || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const provided = headerSecret || bearer

  if (!provided || !safeEqual(provided, env.cronSecret)) {
    return next(new AppError('Invalid cron secret', 401))
  }

  return next()
}
