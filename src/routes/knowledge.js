import { Router } from 'express'
import {
  listPublicPosts,
  getPublicPost,
  listAdminPosts,
  getAdminPost,
  createPost,
  updatePost,
  duplicatePost,
  deletePost,
} from '../controllers/knowledgeController.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'

const router = Router()

router.get('/public', listPublicPosts)
router.get('/public/:slug', getPublicPost)

router.get('/', requireAuth, requirePermission('knowledgeHub'), listAdminPosts)
router.post('/', requireAuth, requirePermission('knowledgeHub'), createPost)
router.post('/:id/duplicate', requireAuth, requirePermission('knowledgeHub'), duplicatePost)
router.get('/:id', requireAuth, requirePermission('knowledgeHub'), getAdminPost)
router.patch('/:id', requireAuth, requirePermission('knowledgeHub'), updatePost)
router.delete('/:id', requireAuth, requirePermission('knowledgeHub'), deletePost)

export default router
