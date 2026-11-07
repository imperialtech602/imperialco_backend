import mongoose from 'mongoose'

const ctaButtonSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    to: { type: String, default: '' },
  },
  { _id: false },
)

const ctaSchema = new mongoose.Schema(
  {
    headline: { type: String, default: '' },
    body: { type: String, default: '' },
    bullets: { type: [String], default: [] },
    buttons: { type: [ctaButtonSchema], default: [] },
    primaryLabel: { type: String, default: '' },
    primaryTo: { type: String, default: '' },
    secondaryLabel: { type: String, default: '' },
    secondaryTo: { type: String, default: '' },
  },
  { _id: false },
)

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['text', 'cta'],
      required: true,
    },
    heading: { type: String, default: '' },
    body: { type: String, default: '' },
    // boxed = mid-content light card; banner = full-width brand CTA
    ctaVariant: {
      type: String,
      enum: ['boxed', 'banner'],
      default: 'boxed',
    },
    cta: { type: ctaSchema, default: () => ({}) },
  },
  { _id: true },
)

const knowledgePostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    isTemplate: { type: Boolean, default: false, index: true },
    blocks: { type: [blockSchema], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    publishedAt: { type: Date },
  },
  { timestamps: true },
)

knowledgePostSchema.index({ title: 'text', excerpt: 'text' })

export const KnowledgePost = mongoose.model('KnowledgePost', knowledgePostSchema)
