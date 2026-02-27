import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginValidator, changePasswordValidator } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

// Public routes
router.post('/login', loginValidator, validateRequest, authController.login);

// Protected routes
router.use(authenticate);
router.get('/profile', authController.getProfile);
router.put('/change-password', changePasswordValidator, validateRequest, auditAction('AUTH'), authController.changePassword);

export default router;
