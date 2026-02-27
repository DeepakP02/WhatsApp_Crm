import { body } from 'express-validator';
import { CHANNELS } from '../constants/channels.js';

export const createTemplateValidator = [
    body('name').notEmpty().withMessage('Template name is required'),
    body('body').notEmpty().withMessage('Template body is required'),
    body('channel').isIn(Object.values(CHANNELS)).withMessage('Invalid channel')
];

export const updateTemplateValidator = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('body').optional().notEmpty().withMessage('Body cannot be empty')
];
