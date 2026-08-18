import { Router } from 'express';
import { importSessions } from '../controllers/import.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { importSchema } from '../validators/search.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(importSchema), importSessions);

export default router;