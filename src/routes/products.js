import { Router } from 'express'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  syncProductsFromSheets,
  downloadTemplate,
  getProductMeta,
  listCatalog,
} from '../controllers/productController.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { requireCronSecret } from '../middleware/cronAuth.js'
import { excelUpload } from '../middleware/upload.js'

const router = Router()
const canProducts = [requireAuth, requirePermission('products')]

router.get('/catalog', listCatalog)
router.get('/meta', ...canProducts, getProductMeta)
router.get('/template', ...canProducts, downloadTemplate)
router.post('/import', ...canProducts, excelUpload.single('file'), importProducts)
/** Cron / external scheduler — protect with CRON_SECRET */
router.post('/sync/sheets', requireCronSecret, syncProductsFromSheets)
/** Admin manual “Sync now” */
router.post('/sync/sheets/manual', ...canProducts, syncProductsFromSheets)
router.get('/', ...canProducts, listProducts)
router.post('/', ...canProducts, createProduct)
router.get('/:id', ...canProducts, getProduct)
router.put('/:id', ...canProducts, updateProduct)
router.delete('/:id', ...canProducts, deleteProduct)

export default router
