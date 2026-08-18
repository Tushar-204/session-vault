import { Router } from 'express';
import authRoutes from './auth.routes.js';
import workspaceRoutes from './workspace.routes.js';
import tabRoutes from './tab.routes.js';
import sharedRoutes from './sharedLink.routes.js';
import folderRoutes from './folder.routes.js';
import searchRoutes from './search.routes.js';
import importRoutes from './import.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/tabs', tabRoutes);
router.use('/shared', sharedRoutes);
router.use('/folders', folderRoutes);
router.use('/search', searchRoutes);
router.use('/import', importRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'SessionVault API v1',
    timestamp: new Date().toISOString(),
  });
});

export default router;
