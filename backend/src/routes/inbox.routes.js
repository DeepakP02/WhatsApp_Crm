import { Router } from 'express';
import * as inboxController from '../controllers/inbox.controller.js';
import { getConversationsValidator, sendMessageValidator } from '../validators/inbox.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);

// Accessible by Counselors, Customer Support, Admins, Super Admins, Managers, TLs
router.get('/conversations', getConversationsValidator, validateRequest, inboxController.getConversations);
router.get('/unread-count', authorize([ROLES.COUNSELOR, ROLES.CUSTOMER_SUPPORT]), inboxController.getUnreadCount);

// Specific conversation operations
router.get('/conversations/:id/messages', inboxController.getMessages);
router.post('/conversations/:id/messages', authorize([ROLES.COUNSELOR, ROLES.CUSTOMER_SUPPORT, ROLES.ADMIN, ROLES.SUPER_ADMIN]), sendMessageValidator, validateRequest, auditAction('SEND_MESSAGE'), inboxController.sendMessage);

export default router;
