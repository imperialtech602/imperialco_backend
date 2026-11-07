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
import { requireAuth } from '../middleware/auth.js'
import { excelUpload } from '../middleware/upload.js'

const router = Router()

router.get('/catalog', listCatalog)
router.get('/meta', requireAuth, getProductMeta)
router.get('/template', requireAuth, downloadTemplate)
router.post('/import', requireAuth, excelUpload.single('file'), importProducts)
router.get('/', requireAuth, listProducts)
router.post('/', requireAuth, createProduct)
router.get('/:id', requireAuth, getProduct)
router.put('/:id', requireAuth, updateProduct)
router.delete('/:id', requireAuth, deleteProduct)

export default router
