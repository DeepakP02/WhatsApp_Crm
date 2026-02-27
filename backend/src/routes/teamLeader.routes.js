import { Router } from 'express';
import { TeamLeaderController } from '../controllers/teamLeader.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize([ROLES.TEAM_LEADER, ROLES.ADMIN, ROLES.SUPER_ADMIN]));

router.get('/performance', TeamLeaderController.getPerformance);
router.get('/dashboard', TeamLeaderController.getDashboardSummary);
router.get('/sla-alerts', TeamLeaderController.getSlaAlerts);

export default router;
