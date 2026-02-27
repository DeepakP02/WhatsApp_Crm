import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/:leadId/summary', aiController.getSummary);
router.post('/:leadId/qualify', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COUNSELOR, ROLES.CUSTOMER_SUPPORT]), auditAction('AI_QUALIFY'), aiController.qualifyLead);

export default router;
