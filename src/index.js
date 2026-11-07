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
import { ensureAdminSeed } from './seed.js'

async function bootstrap() {
  await connectDb()
  await ensureAdminSeed()

  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(
    cors({
      origin: env.clientOrigin,
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

  app.use(notFoundHandler)
  app.use(errorHandler)

  app.listen(env.port, () => {
    console.log(`[api] Listening on http://localhost:${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('[boot] Failed to start server', error)
  process.exit(1)
})
