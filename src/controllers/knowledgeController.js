import { z } from 'zod'
import { KnowledgePost } from '../models/KnowledgePost.js'
import { AppError } from '../middleware/errorHandler.js'

const ctaButtonSchema = z.object({
  label: z.string().optional().default(''),
  to: z.string().optional().default(''),
})

const ctaSchema = z.object({
  headline: z.string().optional().default(''),
  body: z.string().optional().default(''),
  bullets: z.array(z.string()).optional().default([]),
  buttons: z.array(ctaButtonSchema).optional().default([]),
  primaryLabel: z.string().optional().default(''),
  primaryTo: z.string().optional().default(''),
  secondaryLabel: z.string().optional().default(''),
  secondaryTo: z.string().optional().default(''),
})

const blockSchema = z.object({
  type: z.enum(['text', 'cta']),
  heading: z.string().optional().default(''),
  body: z.string().optional().default(''),
  ctaVariant: z.enum(['boxed', 'banner']).optional().default('boxed'),
  cta: ctaSchema.optional(),
})

const postSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  excerpt: z.string().optional().default(''),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional().default([]),
  isTemplate: z.boolean().optional().default(false),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  blocks: z.array(blockSchema).optional().default([]),
})

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function normalizeCta(cta = {}) {
  const stored = Array.isArray(cta.buttons)
    ? cta.buttons
        .filter((button) => button && (button.label || button.to))
        .map((button) => ({
          label: button.label || '',
          to: button.to || '',
        }))
    : []
  const buttons = stored.length
    ? stored
    : [
        cta.primaryLabel || cta.primaryTo
          ? { label: cta.primaryLabel || '', to: cta.primaryTo || '' }
          : null,
        cta.secondaryLabel || cta.secondaryTo
          ? { label: cta.secondaryLabel || '', to: cta.secondaryTo || '' }
          : null,
      ].filter(Boolean)

  return {
    headline: cta.headline || '',
    body: cta.body || '',
    bullets: cta.bullets || [],
    buttons,
    primaryLabel: buttons[0]?.label || '',
    primaryTo: buttons[0]?.to || '',
    secondaryLabel: buttons[1]?.label || '',
    secondaryTo: buttons[1]?.to || '',
  }
}

function normalizeTags(tags = []) {
  const seen = new Set()
  const result = []
  for (const raw of tags) {
    const tag = String(raw || '').trim().replace(/\s+/g, ' ').slice(0, 40)
    if (!tag) continue
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(tag)
    if (result.length >= 12) break
  }
  return result
}

function ctaBasesFromBlocks(blocks = []) {
  const bases = []
  for (const block of blocks) {
    if (block?.type !== 'cta') continue
    const base = block.ctaVariant === 'banner' ? 'banner' : 'boxed'
    if (!bases.includes(base)) bases.push(base)
  }
  return bases
}

function serializePost(doc) {
  const p = doc.toObject ? doc.toObject() : doc
  return {
    id: p._id?.toString?.() || p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    tags: Array.isArray(p.tags) ? p.tags.filter(Boolean) : [],
    isTemplate: Boolean(p.isTemplate),
    ctaBases: ctaBasesFromBlocks(p.blocks),
    status: p.status,
    blocks: (p.blocks || []).map((block) => ({
      id: block._id?.toString?.(),
      type: block.type,
      heading: block.heading || '',
      body: block.body || '',
      ctaVariant: block.ctaVariant || 'boxed',
      cta: normalizeCta(block.cta || {}),
    })),
    author: p.author
      ? {
          id: p.author._id?.toString?.() || p.author.id || p.author,
          name: p.author.name,
          email: p.author.email,
        }
      : null,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

async function uniqueSlug(base, excludeId) {
  let slug = slugify(base) || `post-${Date.now()}`
  let attempt = slug
  let i = 1
  while (true) {
    const query = { slug: attempt }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await KnowledgePost.findOne(query).select('_id')
    if (!exists) return attempt
    attempt = `${slug}-${i}`
    i += 1
  }
}

export async function listPublicPosts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12))
    const filter = { status: 'published', isTemplate: { $ne: true } }
    if (req.query.q) {
      filter.$text = { $search: String(req.query.q).trim() }
    }

    const [items, total] = await Promise.all([
      KnowledgePost.find(filter)
        .populate('author', 'name email')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      KnowledgePost.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: {
        items: items.map(serializePost),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getPublicPost(req, res, next) {
  try {
    const post = await KnowledgePost.findOne({
      slug: req.params.slug,
      status: 'published',
      isTemplate: { $ne: true },
    }).populate('author', 'name email')
    if (!post) throw new AppError('Post not found', 404)
    res.json({ success: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminPosts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))
    const filter = {}
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status
    }
    if (req.query.q) {
      const q = String(req.query.q).trim()
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { excerpt: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') },
        { slug: new RegExp(q, 'i') },
      ]
    }

    const [items, total] = await Promise.all([
      KnowledgePost.find(filter)
        .populate('author', 'name email')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      KnowledgePost.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: {
        items: items.map(serializePost),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getAdminPost(req, res, next) {
  try {
    const post = await KnowledgePost.findById(req.params.id).populate(
      'author',
      'name email',
    )
    if (!post) throw new AppError('Post not found', 404)
    res.json({ success: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function createPost(req, res, next) {
  try {
    const body = postSchema.parse(req.body)
    const slug = await uniqueSlug(body.slug || body.title)
    const post = await KnowledgePost.create({
      title: body.title,
      slug,
      tags: normalizeTags(body.tags),
      excerpt: normalizeTags(body.tags).join(', ') || body.excerpt || '',
      status: body.status,
      isTemplate: Boolean(body.isTemplate),
      blocks: body.blocks,
      author: req.admin._id,
      publishedAt: body.status === 'published' ? new Date() : undefined,
    })
    await post.populate('author', 'name email')
    res.status(201).json({ success: true, data: serializePost(post) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid post data', 400, error.flatten()))
    }
    next(error)
  }
}

export async function updatePost(req, res, next) {
  try {
    const body = postSchema.partial().parse(req.body)
    const post = await KnowledgePost.findById(req.params.id)
    if (!post) throw new AppError('Post not found', 404)

    if (body.title !== undefined) post.title = body.title
    if (body.tags !== undefined) {
      post.tags = normalizeTags(body.tags)
      post.excerpt = post.tags.join(', ')
    } else if (body.excerpt !== undefined) {
      post.excerpt = body.excerpt
    }
    if (body.blocks !== undefined) post.blocks = body.blocks
    if (body.slug !== undefined) {
      post.slug = await uniqueSlug(body.slug || body.title || post.title, post._id)
    }
    if (body.isTemplate !== undefined) post.isTemplate = body.isTemplate
    if (body.status !== undefined) {
      post.status = body.status
      if (body.status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date()
      }
    }

    await post.save()
    await post.populate('author', 'name email')
    res.json({ success: true, data: serializePost(post) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid post data', 400, error.flatten()))
    }
    next(error)
  }
}

function cloneBlocks(blocks = []) {
  return blocks.map((block) => {
    const plain = typeof block.toObject === 'function' ? block.toObject() : { ...block }
    const { _id, ...rest } = plain
    return rest
  })
}

const duplicateFlagsSchema = z.object({
  asTemplate: z.boolean().optional().default(false),
})

export async function duplicatePost(req, res, next) {
  try {
    const flags = duplicateFlagsSchema.parse(req.body ?? {})
    const source = await KnowledgePost.findById(req.params.id)
    if (!source) throw new AppError('Post not found', 404)

    const title = source.title
    const slug = await uniqueSlug(title)
    const post = await KnowledgePost.create({
      title,
      slug,
      excerpt: source.excerpt || '',
      tags: source.tags || [],
      status: 'draft',
      isTemplate: Boolean(flags.asTemplate),
      blocks: cloneBlocks(source.blocks),
      author: req.admin._id,
    })
    await post.populate('author', 'name email')
    res.status(201).json({ success: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await KnowledgePost.findByIdAndDelete(req.params.id)
    if (!post) throw new AppError('Post not found', 404)
    res.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    next(error)
  }
}
