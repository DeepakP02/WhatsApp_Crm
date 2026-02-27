import { body } from 'express-validator';

export const createRoutingRuleValidator = [
    body('country').notEmpty().withMessage('Country is required'),
    body('teamId').isInt().withMessage('Valid teamId is required'),
    body('strategy').isIn(['ROUND_ROBIN', 'LOAD_BASED']).withMessage('Strategy must be ROUND_ROBIN or LOAD_BASED')
];

export const updateRoutingRuleValidator = [
    body('country').optional().notEmpty().withMessage('Country cannot be empty'),
    body('teamId').optional().isInt().withMessage('Valid teamId is required'),
    body('strategy').optional().isIn(['ROUND_ROBIN', 'LOAD_BASED']).withMessage('Invalid strategy')
];
