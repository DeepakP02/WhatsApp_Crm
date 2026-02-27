import { Router } from 'express';
import * as superAdminController from '../controllers/superAdmin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { auditAction } from '../middleware/audit.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize([ROLES.SUPER_ADMIN]));

// Summary & System
router.get('/summary', superAdminController.getSummary);
router.get('/activity', superAdminController.getActivity);

// User Management (Phase 1)
router.get('/users', superAdminController.getUsers);
router.post('/users', auditAction('USER_MGMT'), superAdminController.createUser);
router.put('/users/:id', auditAction('USER_MGMT'), superAdminController.updateUser);
router.patch('/users/:id/status', auditAction('USER_MGMT'), superAdminController.updateUserStatus);

// Lead Operations
router.get('/manual-leads', superAdminController.getManualLeads);
router.post('/dispatch', auditAction('LEAD_DISPATCH'), superAdminController.dispatchLead);

// Audit Logs
router.get('/audit-logs', superAdminController.getAuditLogs);

export default router;
