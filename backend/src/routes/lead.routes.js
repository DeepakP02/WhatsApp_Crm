import { Router } from 'express';
import * as leadController from '../controllers/lead.controller.js';
import * as noteController from '../controllers/note.controller.js';
import * as callController from '../controllers/call.controller.js';
import {
    getLeadsValidator,
    createLeadValidator,
    updateStageValidator,
    assignLeadValidator,
    bulkAssignValidator
} from '../validators/lead.validator.js';
import { createNoteValidator, logCallValidator } from '../validators/note_call.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(authenticate);

// All authenticated roles can access their respective leads
router.get('/', getLeadsValidator, validateRequest, leadController.getLeads);
router.get('/all/notes', noteController.getAllNotes);
router.get('/all/calls', callController.getAllCallLogs);
router.get('/all/qualifications', leadController.getQualifications);
router.get('/:id', leadController.getLeadById);
router.get('/:id/activities', leadController.getLeadActivities);

// Only specific roles can create new leads manually
router.post('/', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT]), createLeadValidator, validateRequest, auditAction('LEADS'), leadController.createLead);

// Stage updates allowed for Counselors (own leads), TLs, Admins, SAs
router.patch('/:id/stage', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.COUNSELOR]), updateStageValidator, validateRequest, auditAction('LEAD_STAGE'), leadController.updateStage);

// Assignments restricted to SA, Admin, TL, Support
router.patch('/:id/assign', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.CUSTOMER_SUPPORT]), assignLeadValidator, validateRequest, auditAction('LEAD_ASSIGN'), leadController.assignLead);
router.post('/bulk-assign', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.CUSTOMER_SUPPORT]), bulkAssignValidator, validateRequest, auditAction('LEAD_BULK_ASSIGN'), leadController.bulkAssign);

// Notes & Calls
router.get('/:leadId/notes', noteController.getNotes);
router.post('/:leadId/notes', createNoteValidator, validateRequest, noteController.addNote);

router.get('/:leadId/calls', callController.getCallLogs);
router.post('/:leadId/calls', logCallValidator, validateRequest, callController.logCall);

export default router;
