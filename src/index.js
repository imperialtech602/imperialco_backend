import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { connectDb } from './config/db.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { uploadsDir } from './middleware/upload.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import userRoutes from './routes/users.js'
import knowledgeRoutes from './routes/knowledge.js'
import { ensureAdminSeed } from './seed.js'

async function bootstrap() {
  await connectDb()
  await ensureAdminSeed()

  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  const allowedOrigins = String(env.clientOrigin)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.use(
    cors({
      origin(origin, callback) {
        const isLocalDev =
          env.nodeEnv !== 'production' &&
          origin &&
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)

        if (
          !origin ||
          allowedOrigins.includes('*') ||
          allowedOrigins.includes(origin) ||
          isLocalDev
        ) {
          return callback(null, true)
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`))
      },
      credentials: true,
    }),
  )
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use('/uploads', express.static(uploadsDir))

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Imperial Co API is running' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/knowledge', knowledgeRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`[api] Listening on port ${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('[boot] Failed to start server', error)
  process.exit(1)
})
