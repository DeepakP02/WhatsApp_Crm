import { body } from 'express-validator';

export const createNoteValidator = [
    body('content').notEmpty().withMessage('Note content is required')
];

export const logCallValidator = [
    body('duration').optional().isInt().withMessage('Duration must be an integer'),
    body('outcome').optional().isString(),
    body('notes').optional().isString(),
    body('calledAt').optional().isISO8601().withMessage('Invalid date format')
];
