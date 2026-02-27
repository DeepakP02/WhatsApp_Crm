import { body } from 'express-validator';

export const updateSettingValidator = [
    body('key').notEmpty().withMessage('Setting key is required'),
    body('value').notEmpty().withMessage('Setting value is required')
];
