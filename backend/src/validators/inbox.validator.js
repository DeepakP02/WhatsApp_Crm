import { body, query } from 'express-validator';
import { CHANNELS } from '../constants/channels.js';

export const getConversationsValidator = [
    query('channel').optional().isIn(Object.values(CHANNELS)).withMessage('Invalid channel'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
];

export const sendMessageValidator = [
    body('body').notEmpty().withMessage('Message body is required')
];
