import { body } from 'express-validator';

export const createTeamValidator = [
    body('name').notEmpty().withMessage('Team name is required'),
    body('country').optional().isString(),
    body('leaderId').optional().isInt()
];

export const updateTeamValidator = [
    body('name').optional().isString(),
    body('country').optional().isString(),
    body('leaderId').optional().isInt()
];

export const addMemberValidator = [
    body('userId').isInt().withMessage('userId is required')
];
