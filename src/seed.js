import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { Admin } from './models/Admin.js'

export async function ensureAdminSeed() {
  const existing = await Admin.findOne({ email: env.adminEmail.toLowerCase() })
  if (existing) return

  const passwordHash = await Admin.hashPassword(env.adminPassword)
  await Admin.create({
    name: 'Imperial Admin',
    email: env.adminEmail.toLowerCase(),
    passwordHash,
    role: 'superadmin',
  })
  console.log(`[seed] Admin created: ${env.adminEmail}`)
}

async function run() {
  await connectDb()
  await ensureAdminSeed()
  console.log('[seed] Ready — no sample catalog or order data')
  process.exit(0)
}

const isDirect = process.argv[1] && process.argv[1].includes('seed.js')
if (isDirect) {
  run().catch((error) => {
    console.error('[seed] Failed', error)
    process.exit(1)
  })
}
