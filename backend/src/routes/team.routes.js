import { Router } from 'express';
import * as teamController from '../controllers/team.controller.js';
import { createTeamValidator, updateTeamValidator, addMemberValidator } from '../validators/team.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

// View teams limits to Management and above based on contract
router.get('/', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TEAM_LEADER]), teamController.getTeams);

// Modify teams isolated to Admins and above
router.post('/', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), createTeamValidator, validateRequest, teamController.createTeam);
router.put('/:id', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), updateTeamValidator, validateRequest, teamController.updateTeam);
router.post('/:id/members', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), addMemberValidator, validateRequest, teamController.addMember);

export default router;
