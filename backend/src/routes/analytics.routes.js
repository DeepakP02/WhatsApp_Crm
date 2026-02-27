import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { analyticsFilterValidator } from '../validators/analytics.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);
// TLs also get analytics access for counselor performance
router.use(authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TEAM_LEADER]));

router.get('/funnel', analyticsFilterValidator, validateRequest, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]), analyticsController.getFunnelData);
router.get('/country', analyticsFilterValidator, validateRequest, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]), analyticsController.getCountryPerformance);
router.get('/sla', analyticsFilterValidator, validateRequest, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]), analyticsController.getSlaReports);
router.get('/performance', analyticsFilterValidator, validateRequest, analyticsController.getCounselorPerformance);

export default router;
