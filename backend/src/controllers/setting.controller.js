import { SettingService } from '../services/setting.service.js';
import { successResponse } from '../utils/response.js';

export const getAllSettings = async (req, res, next) => {
    try {
        const settings = await SettingService.getAllSettings();
        return successResponse(res, settings);
    } catch (error) {
        next(error);
    }
};

export const getSetting = async (req, res, next) => {
    try {
        const value = await SettingService.getSetting(req.params.key);
        return successResponse(res, { [req.params.key]: value });
    } catch (error) {
        next(error);
    }
};

export const updateSetting = async (req, res, next) => {
    try {
        const { key, value } = req.body;
        const setting = await SettingService.updateSetting(key, value);
        return successResponse(res, setting, 'Setting updated successfully');
    } catch (error) {
        next(error);
    }
};
