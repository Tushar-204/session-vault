import { Router } from 'express';
import { searchAll, searchSuggestions } from '../controllers/search.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { searchSchema } from '../validators/search.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(searchSchema), searchAll);
router.get('/suggestions', validate(searchSchema), searchSuggestions);

export default router;