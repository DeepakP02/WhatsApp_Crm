import express from 'express';
import { ManagerController } from '../controllers/manager.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['MANAGER', 'ADMIN', 'SUPER_ADMIN']));

router.get('/summary', ManagerController.getSummary);
router.get('/funnel', ManagerController.getFunnel);
router.get('/country-performance', ManagerController.getCountryPerformance);
router.get('/sla', authorize(['MANAGER', 'ADMIN', 'SUPER_ADMIN', 'TEAM_LEADER']), ManagerController.getSla);
router.get('/conversion', ManagerController.getConversion);
router.get('/team-performance', ManagerController.getTeamPerformance);
router.get('/calls', ManagerController.getCalls);

export default router;
