import { NoteService } from '../services/note.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const addNote = async (req, res, next) => {
    try {
        const note = await NoteService.addNote(req.params.leadId, req.body.content, req.user);
        return successResponse(res, note, 'Note added successfully', 201);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const getNotes = async (req, res, next) => {
    try {
        const notes = await NoteService.getNotes(req.params.leadId, req.user);
        return successResponse(res, notes);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};
export const getAllNotes = async (req, res, next) => {
    try {
        const notes = await NoteService.getAllNotes(req.user);
        return successResponse(res, notes);
    } catch (error) {
        next(error);
    }
};
