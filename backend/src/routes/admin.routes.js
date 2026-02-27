import express from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import templateRoutes from './template.routes.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPER_ADMIN']));

// Channels
router.get('/channels', AdminController.getChannels);
router.post('/channels/connect', AdminController.connectChannel);
router.post('/channels/disconnect', AdminController.disconnectChannel);

// Routing
router.get('/routing', AdminController.getRoutingRules);
router.post('/routing', AdminController.createRoutingRule);
router.put('/routing/:id', AdminController.updateRoutingRule);

// User Management
router.get('/users', AdminController.getUsers);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.patch('/users/:id/status', AdminController.updateUserStatus);

// AI Config
router.get('/ai-config', AdminController.getAiConfig);
router.put('/ai-config', AdminController.updateAiConfig);

// Working Hours
router.get('/working-hours', AdminController.getWorkingHours);
router.put('/working-hours', AdminController.updateWorkingHours);

// Templates Library
router.use('/templates', templateRoutes);

export default router;
