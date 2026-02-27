import { Router } from 'express';
import * as slaController from '../controllers/sla.controller.js';
import { updateSlaValidator } from '../validators/sla.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);

// Status route: Admins, Managers, Team Leaders
router.get('/', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TEAM_LEADER]), slaController.getStatus);

// Config routes: Admins only
router.get('/config', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), slaController.getConfig);
router.put('/config', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), updateSlaValidator, validateRequest, auditAction('SLA_CONFIG'), slaController.updateConfig);

export default router;
