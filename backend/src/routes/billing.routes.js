import { Router } from 'express';
import * as billingController from '../controllers/billing.controller.js';
import { createPlanValidator, updatePlanValidator } from '../validators/billing.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize([ROLES.SUPER_ADMIN]));

router.get('/plans', billingController.getPlans);
router.post('/plans', createPlanValidator, validateRequest, billingController.createPlan);
router.put('/plans/:id', updatePlanValidator, validateRequest, billingController.updatePlan);

router.get('/subscriptions', billingController.getSubscriptions);

export default router;
