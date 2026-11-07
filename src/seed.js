import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { Admin } from './models/Admin.js'

export async function ensureAdminSeed() {
  const email = env.adminEmail.toLowerCase()
  const existing = await Admin.findOne({ email })

  const fullPermissions = {
    products: true,
    orders: true,
    knowledgeHub: true,
  }

  if (existing) {
    // Keep password in sync with .env for local/dev convenience
    existing.passwordHash = await Admin.hashPassword(env.adminPassword)
    existing.name = existing.name || 'Imperial Admin'
    existing.role = 'superadmin'
    existing.permissions = fullPermissions
    existing.isActive = true
    await existing.save()
    console.log(`[seed] Admin updated: ${email}`)
    return
  }

  const passwordHash = await Admin.hashPassword(env.adminPassword)
  await Admin.create({
    name: 'Imperial Admin',
    email,
    passwordHash,
    role: 'superadmin',
    permissions: fullPermissions,
  })
  console.log(`[seed] Admin created: ${email}`)
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
