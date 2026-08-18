import { Router } from 'express';
import { createShareLink, getSharedWorkspace } from '../controllers/sharedLink.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public route to view a shared session
router.get('/:code', getSharedWorkspace);

// Authenticated route to generate a share link
router.post('/workspace/:workspaceId', authenticate, createShareLink);

export default router;
