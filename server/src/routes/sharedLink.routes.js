import { Router } from 'express';
import { listMySharedLinks, createShareLink, getSharedWorkspace } from '../controllers/sharedLink.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// List the current user's shared links
router.get('/', authenticate, listMySharedLinks);

// Public route to view a shared session
router.get('/:code', getSharedWorkspace);

// Authenticated route to generate a share link
router.post('/workspace/:workspaceId', authenticate, createShareLink);

export default router;
