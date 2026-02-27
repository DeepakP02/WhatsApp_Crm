import { body } from 'express-validator';

export const updateSlaValidator = [
    body('responseMinutes').isInt({ min: 1 }).withMessage('responseMinutes must be a positive integer'),
    body('escalateMinutes').isInt({ min: 1 }).withMessage('escalateMinutes must be a positive integer')
];
