/**
 * Upsert the 7 live Knowledge Hub articles into a running API
 * (local or production) via admin auth.
 *
 * Usage:
 *   node src/seedKnowledgeViaApi.js
 *   API_URL=https://imperialco-backend.onrender.com/api node src/seedKnowledgeViaApi.js
 */
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { KNOWLEDGE_SEED_ARTICLES } from './data/knowledgeSeedArticles.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const API_URL = (process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:5000/api').replace(
  /\/$/,
  '',
)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@imperialco.biz'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456'

async function api(pathname, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${API_URL}${pathname}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `${method} ${pathname} failed (${res.status})`)
  }
  return data
}

async function run() {
  console.log(`[seed-api] Target ${API_URL}`)
  const login = await api('/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  const token = login.data?.token || login.token
  if (!token) throw new Error('Login succeeded but no token returned')

  const list = await api('/knowledge?limit=100', { token })
  const existing = list.data?.items || []
  const bySlug = new Map(existing.map((item) => [item.slug, item]))

  let created = 0
  let updated = 0

  for (const article of KNOWLEDGE_SEED_ARTICLES) {
    const basePayload = {
      title: article.title,
      slug: article.slug,
      tags: article.tags,
      status: 'published',
      blocks: article.blocks,
      isTemplate: false,
    }

    const found = bySlug.get(article.slug)
    if (found) {
      // Content first (older APIs overwrite excerpt when tags are sent)
      await api(`/knowledge/${found.id}`, { method: 'PATCH', token, body: basePayload })
      // Excerpt + original publish date in a follow-up without tags
      await api(`/knowledge/${found.id}`, {
        method: 'PATCH',
        token,
        body: {
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          status: 'published',
        },
      })
      updated += 1
      console.log(`[seed-api] updated ${article.slug}`)
    } else {
      await api('/knowledge', {
        method: 'POST',
        token,
        body: {
          ...basePayload,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
        },
      })
      const createdList = await api('/knowledge?limit=100', { token })
      const createdPost = (createdList.data?.items || []).find((item) => item.slug === article.slug)
      if (createdPost?.id) {
        await api(`/knowledge/${createdPost.id}`, {
          method: 'PATCH',
          token,
          body: {
            excerpt: article.excerpt,
            publishedAt: article.publishedAt,
            status: 'published',
          },
        })
      }
      created += 1
      console.log(`[seed-api] created ${article.slug}`)
    }
  }

  console.log(`[seed-api] Done. created=${created} updated=${updated}`)
}

run().catch((error) => {
  console.error('[seed-api] Failed', error.message)
  process.exit(1)
})
