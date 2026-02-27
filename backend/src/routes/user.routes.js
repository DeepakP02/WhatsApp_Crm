import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { createUserValidator, updateUserValidator, updateStatusValidator } from '../validators/user.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]));

router.get('/', userController.getUsers);
router.post('/', createUserValidator, validateRequest, auditAction('USERS'), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', updateUserValidator, validateRequest, auditAction('USERS'), userController.updateUser);
router.patch('/:id/status', updateStatusValidator, validateRequest, auditAction('USERS'), userController.updateStatus);

export default router;
