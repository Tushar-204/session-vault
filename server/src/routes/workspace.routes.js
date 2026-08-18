import { Router } from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  toggleFavorite,
  moveToTrash,
  restoreFromTrash,
  deletePermanently,
  exportSession,
  getAnalyticsStats,
} from '../controllers/workspace.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../validators/workspace.validator.js';

const router = Router();

// Protect all workspace routes
router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), createWorkspace);
router.get('/', getWorkspaces);
router.get('/analytics', getAnalyticsStats);
router.get('/:id', getWorkspaceById);
router.patch('/:id', validate(updateWorkspaceSchema), updateWorkspace);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/trash', moveToTrash);
router.post('/:id/restore', restoreFromTrash);
router.delete('/:id', deletePermanently);
router.get('/:id/export', exportSession);

export default router;
