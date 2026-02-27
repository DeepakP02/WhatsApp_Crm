import { query } from 'express-validator';

export const analyticsFilterValidator = [
    query('dateFrom').optional().isISO8601().withMessage('Invalid start date format'),
    query('dateTo').optional().isISO8601().withMessage('Invalid end date format'),
    query('country').optional().isString()
];
