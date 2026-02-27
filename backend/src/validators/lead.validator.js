import { body, query } from 'express-validator';
import { ROLES } from '../constants/roles.js';

export const getLeadsValidator = [
    query('stage').optional().isString(),
    query('country').optional().isString(),
    query('assignedTo').optional().isInt(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
];

export const createLeadValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').optional().isEmail().normalizeEmail(),
    body('country').notEmpty().withMessage('Country is required'),
    body('source').notEmpty().withMessage('Source is required'),
    body('program').optional().isString(),
    body('intake').optional().isString(),
    body('budget').optional().isNumeric()
];

export const assignLeadValidator = [
    body('assignedToId').isInt().withMessage('Valid User ID is required')
];

export const bulkAssignValidator = [
    body('leadIds').isArray({ min: 1 }).withMessage('Array of leadIds is required'),
    body('leadIds.*').isInt(),
    body('assignedToId').isInt().withMessage('Valid User ID is required')
];

export const updateStageValidator = [
    body('stage').isIn(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'ENROLLED', 'LOST']).withMessage('Invalid stage')
];
