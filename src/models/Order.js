import mongoose from 'mongoose'

const orderProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    itemId: { type: String, default: '' },
    itemName: { type: String, required: true },
    manufacturer: { type: String, default: '' },
    countryOfOrigin: { type: String, default: '' },
    dosageForm: { type: String, default: '' },
    therapeuticClass: { type: String, default: '' },
    brandName: { type: String, default: '' },
    generic: { type: String, default: '' },
    strength: { type: String, default: '' },
    packSize: { type: String, default: '' },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ['rfq', 'quote-modal'],
      default: 'rfq',
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'quoted', 'closed', 'cancelled'],
      default: 'new',
      index: true,
    },
    products: { type: [orderProductSchema], default: [] },
    customProduct: { type: String, default: '' },
    packs: { type: String, default: '' },
    originPreference: { type: String, default: '' },
    notes: { type: String, default: '' },
    intendedUse: { type: String, default: '' },
    targetMarket: { type: String, default: '' },
    requiredBy: { type: Date },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, index: true },
    attachmentName: { type: String, default: '' },
    attachmentPath: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true },
)

orderSchema.index({ createdAt: -1 })
orderSchema.index({
  firstName: 'text',
  lastName: 'text',
  company: 'text',
  email: 'text',
  customProduct: 'text',
  orderNumber: 'text',
})

export const Order = mongoose.model('Order', orderSchema)
