import { connectDb } from './config/db.js'
import { Product } from './models/Product.js'
import { Order } from './models/Order.js'

async function run() {
  await connectDb()
  const [products, orders] = await Promise.all([
    Product.deleteMany({}),
    Order.deleteMany({}),
  ])
  console.log(`[clear] Removed ${products.deletedCount} products and ${orders.deletedCount} orders`)
  process.exit(0)
}

run().catch((error) => {
  console.error('[clear] Failed', error)
  process.exit(1)
})
