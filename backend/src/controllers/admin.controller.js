import { AdminService } from '../services/admin.service.js';
import { RoutingService } from '../services/routing.service.js';
import { UserService } from '../services/user.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class AdminController {
    // Channels
    static async getChannels(req, res) {
        try {
            const stats = await AdminService.getChannelStats();
            return successResponse(res, stats);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async connectChannel(req, res) {
        try {
            const { type } = req.body;
            await AdminService.updateChannelStatus(type, 'active');
            return successResponse(res, { message: `${type} connected` });
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async disconnectChannel(req, res) {
        try {
            const { type } = req.body;
            await AdminService.updateChannelStatus(type, 'inactive');
            return successResponse(res, { message: `${type} disconnected` });
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    // Routing
    static async getRoutingRules(req, res) {
        try {
            const rules = await RoutingService.getRules();
            return successResponse(res, rules);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async createRoutingRule(req, res) {
        try {
            const rule = await RoutingService.createRule(req.body);
            return successResponse(res, rule, 'Routing rule created', 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async updateRoutingRule(req, res) {
        try {
            const rule = await RoutingService.updateRule(req.params.id, req.body);
            return successResponse(res, rule, 'Routing rule updated');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    // User Management
    static async getUsers(req, res) {
        try {
            const data = await UserService.getUsers(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            return successResponse(res, user, 'User created', 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async updateUser(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            return successResponse(res, user, 'User updated');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async updateUserStatus(req, res) {
        try {
            const { status } = req.body;
            const user = await UserService.updateStatus(req.params.id, status);
            return successResponse(res, user, 'User status updated');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    // AI Config
    static async getAiConfig(req, res) {
        try {
            const config = await AdminService.getAiConfig();
            return successResponse(res, config);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async updateAiConfig(req, res) {
        try {
            const config = await AdminService.updateAiConfig(req.body);
            return successResponse(res, config, 'AI Configuration updated');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    // Working Hours
    static async getWorkingHours(req, res) {
        try {
            const hours = await AdminService.getWorkingHours();
            return successResponse(res, hours);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async updateWorkingHours(req, res) {
        try {
            const hours = await AdminService.updateWorkingHours(req.body);
            return successResponse(res, hours, 'Working hours updated');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}
