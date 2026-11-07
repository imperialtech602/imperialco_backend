import { Router } from 'express'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  downloadTemplate,
  getProductMeta,
  listCatalog,
} from '../controllers/productController.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { excelUpload } from '../middleware/upload.js'

const router = Router()
const canProducts = [requireAuth, requirePermission('products')]

router.get('/catalog', listCatalog)
router.get('/meta', ...canProducts, getProductMeta)
router.get('/template', ...canProducts, downloadTemplate)
router.post('/import', ...canProducts, excelUpload.single('file'), importProducts)
router.get('/', ...canProducts, listProducts)
router.post('/', ...canProducts, createProduct)
router.get('/:id', ...canProducts, getProduct)
router.put('/:id', ...canProducts, updateProduct)
router.delete('/:id', ...canProducts, deleteProduct)

export default router
