import { Router } from 'express';
import * as templateController from '../controllers/template.controller.js';
import { createTemplateValidator, updateTemplateValidator } from '../validators/template.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);

// Read-only access for Counselor & Support
router.get('/', templateController.getTemplates);

// Write access for Admin & Super Admin
router.post('/', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), createTemplateValidator, validateRequest, auditAction('TEMPLATES'), templateController.createTemplate);
router.put('/:id', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), updateTemplateValidator, validateRequest, auditAction('TEMPLATES'), templateController.updateTemplate);
router.delete('/:id', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), auditAction('TEMPLATES'), templateController.deleteTemplate);

export default router;
