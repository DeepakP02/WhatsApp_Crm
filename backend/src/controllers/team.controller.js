import { TeamService } from '../services/team.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getTeams = async (req, res, next) => {
    try {
        const teams = await TeamService.getTeams();
        return successResponse(res, teams);
    } catch (error) {
        next(error);
    }
};

export const createTeam = async (req, res, next) => {
    try {
        const team = await TeamService.createTeam(req.body);
        return successResponse(res, team, 'Team created successfully', 201);
    } catch (error) {
        if (error.code === 'P2002') return errorResponse(res, 'A team with this leader already exists', 400);
        next(error);
    }
};

export const updateTeam = async (req, res, next) => {
    try {
        const team = await TeamService.updateTeam(req.params.id, req.body);
        return successResponse(res, team, 'Team updated successfully');
    } catch (error) {
        if (error.message.includes('not found')) return errorResponse(res, error.message, 404);
        if (error.code === 'P2002') return errorResponse(res, 'A team with this leader already exists', 400);
        next(error);
    }
};

export const addMember = async (req, res, next) => {
    try {
        await TeamService.addMember(req.params.id, req.body.userId);
        return successResponse(res, null, 'User added to team successfully');
    } catch (error) {
        if (error.message.includes('not found')) return errorResponse(res, error.message, 404);
        next(error);
    }
};
