import { body } from 'express-validator';
import { ROLES } from '../constants/roles.js';

export const createUserValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(Object.values(ROLES)).withMessage('Invalid role provided'),
    body('teamId').optional().isInt().withMessage('Team ID must be an integer'),
    body('country').optional().isString().withMessage('Country must be a string')
];

export const updateUserValidator = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role provided'),
    body('teamId').optional().isInt().withMessage('Team ID must be an integer'),
    body('country').optional().isString().withMessage('Country must be a string')
];

export const updateStatusValidator = [
    body('status').isIn(['ACTIVE', 'INACTIVE']).withMessage('Invalid status')
];
