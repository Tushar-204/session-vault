import { Router } from 'express';
import { deleteTab } from '../controllers/tab.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.delete('/:tabId', deleteTab);

export default router;
