import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  getDashboardStats,
  downloadOrderAttachment,
} from '../controllers/orderController.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
})

function optionalAttachment(req, res, next) {
  const contentType = req.headers['content-type'] || ''
  if (contentType.includes('multipart/form-data')) {
    return upload.single('attachment')(req, res, next)
  }
  return next()
}

router.post('/', submitLimiter, optionalAttachment, createOrder)
router.get('/stats/dashboard', requireAuth, getDashboardStats)
router.get('/', requireAuth, listOrders)
router.get('/:id/attachment', requireAuth, downloadOrderAttachment)
router.get('/:id', requireAuth, getOrder)
router.patch('/:id', requireAuth, updateOrder)

export default router
