import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const permissionsSchema = new mongoose.Schema(
  {
    products: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    knowledgeHub: { type: Boolean, default: false },
  },
  { _id: false },
)

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    permissions: {
      type: permissionsSchema,
      default: () => ({
        products: false,
        orders: false,
        knowledgeHub: false,
      }),
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

adminSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash)
}

adminSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

adminSchema.methods.hasPermission = function hasPermission(key) {
  if (this.role === 'superadmin') return true
  return Boolean(this.permissions?.[key])
}

adminSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    permissions: {
      products: this.role === 'superadmin' ? true : Boolean(this.permissions?.products),
      orders: this.role === 'superadmin' ? true : Boolean(this.permissions?.orders),
      knowledgeHub:
        this.role === 'superadmin' ? true : Boolean(this.permissions?.knowledgeHub),
    },
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Admin = mongoose.model('Admin', adminSchema)
