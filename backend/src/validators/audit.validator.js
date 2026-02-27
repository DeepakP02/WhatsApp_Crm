import { query } from 'express-validator';

export const getAuditLogsValidator = [
    query('module').optional().isString().withMessage('Module must be a string'),
    query('userId').optional().isInt().withMessage('User ID must be an integer'),
    query('dateFrom').optional().isISO8601().withMessage('Invalid start date format'),
    query('dateTo').optional().isISO8601().withMessage('Invalid end date format'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
