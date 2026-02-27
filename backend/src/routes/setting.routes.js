import { Router } from 'express';
import * as settingController from '../controllers/setting.controller.js';
import { updateSettingValidator } from '../validators/setting.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);

// Settings accessible by Admin
router.use(authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]));

router.get('/', settingController.getAllSettings);
router.get('/:key', settingController.getSetting);
router.put('/', updateSettingValidator, validateRequest, auditAction('SETTINGS'), settingController.updateSetting);

export default router;
