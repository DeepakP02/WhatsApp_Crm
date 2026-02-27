import { Router } from 'express';
import * as auditController from '../controllers/audit.controller.js';
import { getAuditLogsValidator } from '../validators/audit.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize([ROLES.SUPER_ADMIN, ROLES.TEAM_LEADER]));

router.get('/', getAuditLogsValidator, validateRequest, auditController.getAuditLogs);

export default router;
