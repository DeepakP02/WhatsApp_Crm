import { body } from 'express-validator';

export const createPlanValidator = [
    body('planName').notEmpty().withMessage('Plan name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('cycle').notEmpty().withMessage('Cycle is required')
];

export const updatePlanValidator = [
    body('planName').optional().isString(),
    body('price').optional().isNumeric(),
    body('cycle').optional().isString(),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']).withMessage('Invalid status')
];
