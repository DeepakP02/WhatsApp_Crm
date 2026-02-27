import { Router } from 'express';
import * as routingController from '../controllers/routing.controller.js';
import { createRoutingRuleValidator, updateRoutingRuleValidator } from '../validators/routing.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]));

router.get('/', routingController.getRules);
router.post('/', createRoutingRuleValidator, validateRequest, auditAction('ROUTING_RULES'), routingController.createRule);
router.put('/:id', updateRoutingRuleValidator, validateRequest, auditAction('ROUTING_RULES'), routingController.updateRule);
router.delete('/:id', auditAction('ROUTING_RULES'), routingController.deleteRule);

// Manual trigger for routing
router.post('/run', auditAction('ROUTING_EXECUTE'), routingController.runRouting);

export default router;
