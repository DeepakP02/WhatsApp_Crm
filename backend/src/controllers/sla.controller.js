import { SlaService } from '../services/sla.service.js';
import { successResponse } from '../utils/response.js';

export const getConfig = async (req, res, next) => {
    try {
        const config = await SlaService.getConfig();
        return successResponse(res, config);
    } catch (error) {
        next(error);
    }
};

export const updateConfig = async (req, res, next) => {
    try {
        const config = await SlaService.updateConfig(req.body);
        return successResponse(res, config, 'SLA configuration updated');
    } catch (error) {
        next(error);
    }
};

export const getStatus = async (req, res, next) => {
    try {
        let statuses = await SlaService.getSlaStatus();
        const config = await SlaService.getConfig();
        const now = new Date();

        // Attach real-time computed breach logic
        statuses = statuses.map(status => {
            let minutesSinceLastResponse = 0;
            let isBreached = status.isBreached;

            if (status.lastResponseAt) {
                minutesSinceLastResponse = Math.floor((now - new Date(status.lastResponseAt)) / 60000);
                if (minutesSinceLastResponse > config.responseMinutes) {
                    isBreached = true;
                }
            }

            return {
                ...status,
                isBreached,
                minutesSinceLastResponse
            };
        });

        return successResponse(res, statuses);
    } catch (error) {
        next(error);
    }
};
