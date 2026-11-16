import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { Admin } from './models/Admin.js'
import { KnowledgePost } from './models/KnowledgePost.js'
import { KNOWLEDGE_SEED_ARTICLES } from './data/knowledgeSeedArticles.js'

export async function ensureAdminSeed() {
  const email = env.adminEmail.toLowerCase()
  const existing = await Admin.findOne({ email })

  const fullPermissions = {
    products: true,
    orders: true,
    knowledgeHub: true,
  }

  if (existing) {
    existing.passwordHash = await Admin.hashPassword(env.adminPassword)
    existing.name = existing.name || 'Imperial Admin'
    existing.role = 'superadmin'
    existing.permissions = fullPermissions
    existing.isActive = true
    await existing.save()
    console.log(`[seed] Admin updated: ${email}`)
    return existing
  }

  const passwordHash = await Admin.hashPassword(env.adminPassword)
  const created = await Admin.create({
    name: 'Imperial Admin',
    email,
    passwordHash,
    role: 'superadmin',
    permissions: fullPermissions,
  })
  console.log(`[seed] Admin created: ${email}`)
  return created
}

export async function ensureKnowledgeSeed(authorId) {
  let upserted = 0
  for (const article of KNOWLEDGE_SEED_ARTICLES) {
    const publishedAt = new Date(`${article.publishedAt}T12:00:00.000Z`)
    const payload = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      tags: article.tags,
      status: 'published',
      isTemplate: false,
      blocks: article.blocks,
      author: authorId,
      publishedAt,
    }

    await KnowledgePost.findOneAndUpdate(
      { slug: article.slug },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    upserted += 1
  }
  console.log(`[seed] Knowledge Hub articles upserted: ${upserted}`)
}

async function run() {
  await connectDb()
  const admin = await ensureAdminSeed()
  await ensureKnowledgeSeed(admin._id)
  console.log('[seed] Ready')
  process.exit(0)
}

const isDirect = process.argv[1] && process.argv[1].includes('seed.js')
if (isDirect) {
  run().catch((error) => {
    console.error('[seed] Failed', error)
    process.exit(1)
  })
}
