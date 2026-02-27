import { useQuery } from '@tanstack/react-query';
import teamLeaderApi from '../api/teamLeader.api';
import { useCrmMutation } from './useCrmMutations';

export const useTeamLeaderActions = () => {
    // Queries
    const useDashboard = () => useQuery({
        queryKey: ['teamLeader', 'dashboard'],
        queryFn: () => teamLeaderApi.fetchDashboard()
    });

    const useInbox = () => useQuery({
        queryKey: ['teamLeader', 'inbox'],
        queryFn: () => teamLeaderApi.fetchTeamLeads({ stage: 'NEW' })
    });

    const useLeads = (filters) => useQuery({
        queryKey: ['teamLeader', 'leads', filters],
        queryFn: () => teamLeaderApi.fetchTeamLeads(filters)
    });

    const usePerformance = (filters) => useQuery({
        queryKey: ['teamLeader', 'performance', filters],
        queryFn: () => teamLeaderApi.fetchPerformance(filters)
    });

    const useReassignList = (filters) => useQuery({
        queryKey: ['teamLeader', 'reassignList', filters],
        queryFn: () => teamLeaderApi.fetchTeamLeads(filters)
    });

    const useSlaAlerts = (filters) => useQuery({
        queryKey: ['teamLeader', 'slaAlerts', filters],
        queryFn: () => teamLeaderApi.fetchSlaAlerts(filters)
    });

    const useActivityLogs = (filters) => useQuery({
        queryKey: ['teamLeader', 'activityLogs', filters],
        queryFn: () => teamLeaderApi.fetchActivityLogs(filters)
    });

    // Mutations
    const sendReminder = useCrmMutation({
        mutationFn: (counselorId) => Promise.resolve(), // Mock for now
        successMessage: "Reminder sent to counselor successfully",
    });

    const reassignLead = useCrmMutation({
        mutationFn: ({ leadIds, assignedToId }) => teamLeaderApi.reassignLeads(leadIds, assignedToId),
        successMessage: "Leads reassigned successfully",
        invalidateQueries: ['teamLeader']
    });

    const updateLeadStatus = useCrmMutation({
        mutationFn: ({ leadId, status }) => Promise.resolve(), // LeadService handles this
        successMessage: "Lead status updated successfully",
        invalidateQueries: ['teamLeader', 'leads']
    });

    const addTeamNote = useCrmMutation({
        mutationFn: (noteData) => Promise.resolve(), // NoteService handles this
        successMessage: "Team note added successfully",
        invalidateQueries: ['teamLeader', 'activityLogs']
    });

    // Utilities
    const refreshData = (type) => useCrmMutation({
        mutationFn: () => Promise.resolve(), // React Query handles the actual refetch via invalidation
        successMessage: `${type.toUpperCase()} data refreshed`,
        invalidateQueries: ['teamLeader', type]
    });

    return {
        useDashboard,
        useInbox,
        useLeads,
        usePerformance,
        useReassignList,
        useSlaAlerts,
        useActivityLogs,
        sendReminder,
        reassignLead,
        updateLeadStatus,
        addTeamNote,
        refreshData
    };
};
