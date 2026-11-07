import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    itemType: {
      type: String,
      trim: true,
      default: 'inventory',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
      index: true,
    },
    salesDescription: { type: String, trim: true, default: '' },
    salesRate: { type: Number, default: 0 },
    purchaseDescription: { type: String, trim: true, default: '' },
    purchaseRate: { type: Number, default: 0 },
    brandName: { type: String, trim: true, default: '', index: true },
    generic: { type: String, trim: true, default: '', index: true },
    strength: { type: String, trim: true, default: '' },
    packSize: { type: String, trim: true, default: '' },
    dosageForm: { type: String, trim: true, default: '', index: true },
    countryOfOrigin: { type: String, trim: true, default: '', index: true },
    sourceCode: { type: String, trim: true, default: '', index: true },
    therapeuticClass: { type: String, trim: true, default: '', index: true },
    manufacturer: { type: String, trim: true, default: '', index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

productSchema.index({
  itemName: 'text',
  brandName: 'text',
  generic: 'text',
  manufacturer: 'text',
  therapeuticClass: 'text',
  salesDescription: 'text',
})

export const Product = mongoose.model('Product', productSchema)
