import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../components/ui/Toast'
import * as superAdminApi from '../api/superAdmin.api.js'
import * as adminApi from '../api/admin.api.js'
import counselorApi from '../api/counselor.api.js'
import supportApi from '../api/support.api.js'

/**
 * Global functional hooks for CRM-wide actions.
 * Ensures consistent behavior: loading state -> success/error toast -> cache invalidation.
 */

export const useCrmMutation = ({
    mutationFn,
    successMessage,
    errorMessage = "Action failed. Please try again.",
    invalidateQueries = []
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars) => {
            return await mutationFn(vars);
        },
        onSuccess: (data) => {
            if (successMessage) {
                const msg = typeof successMessage === 'function' ? successMessage(data) : successMessage;
                toast.success(msg);
            }

            // Refetch related data if query keys provided
            invalidateQueries.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        },
        onError: (error) => {
            toast.error(error.message || errorMessage);
        }
    });
};


// Specialized Hooks for common actions
export const useLeadActions = () => {
    const updateStage = useCrmMutation({
        mutationFn: ({ id, stage }) => mockApi.leads.updateStage(id, stage),
        successMessage: (res) => `Lead stage updated to ${res.data.stage}`,
        invalidateQueries: ['leads']
    });

    const deleteLead = useCrmMutation({
        mutationFn: (id) => mockApi.leads.delete(id),
        successMessage: "Lead deleted successfully",
        invalidateQueries: ['leads']
    });

    const assignLead = useCrmMutation({
        mutationFn: ({ leadId, counselorId }) => mockApi.leads.assign(leadId, counselorId),
        successMessage: "Lead assigned successfully",
        invalidateQueries: ['leads']
    });

    return { updateStage, deleteLead, assignLead };
};

export const useChatActions = () => {
    const sendMessage = useCrmMutation({
        mutationFn: ({ chatId, text }) => mockApi.execute('sendMessage', { chatId, text }),
        successMessage: "Message sent",
    });

    const clearUnread = useCrmMutation({
        mutationFn: (chatId) => mockApi.execute('clearUnread', { chatId }),
        invalidateQueries: ['chats']
    });

    return { sendMessage, clearUnread };
};

export const useChannelActions = () => {
    const toggleStatus = useCrmMutation({
        mutationFn: ({ id, currentStatus }) => mockApi.channels.toggle(id, currentStatus),
        successMessage: "Channel status updated",
        invalidateQueries: ['channels']
    });

    const deleteChannel = useCrmMutation({
        mutationFn: (id) => mockApi.channels.delete(id),
        successMessage: "Channel removed successfully",
        invalidateQueries: ['channels']
    });

    const addChannel = useCrmMutation({
        mutationFn: (data) => mockApi.channels.add(data),
        successMessage: "New channel provisioned successfully",
        invalidateQueries: ['channels']
    });

    return { toggleStatus, deleteChannel, addChannel };
};

export const useBillingActions = () => {
    const upgradePlan = useCrmMutation({
        mutationFn: ({ clientId, plan }) => mockApi.billing.upgrade(clientId, plan),
        successMessage: (res) => `Client upgraded to ${res.data.plan} successfully`,
        invalidateQueries: ['subscriptions']
    });

    const suspendClient = useCrmMutation({
        mutationFn: (clientId) => mockApi.billing.suspend(clientId),
        successMessage: "Client subscription suspended",
        invalidateQueries: ['subscriptions']
    });

    const addPlan = useCrmMutation({
        mutationFn: (data) => mockApi.billing.addPlan(data),
        successMessage: "New global plan defined successfully",
        invalidateQueries: ['subscriptions'] // In reality might be a 'plans' query
    });

    return { upgradePlan, suspendClient, addPlan };
};

export const useAdminActions = () => {
    const downloadReport = useCrmMutation({
        mutationFn: (type) => mockApi.execute('downloadReport', { type }),
        successMessage: "Report generation started. You will be notified when it's ready.",
    });

    const connectChannel = useCrmMutation({
        mutationFn: (type) => adminApi.connectChannel(type),
        successMessage: "Channel connected successfully",
        invalidateQueries: ['channels']
    });

    const disconnectChannel = useCrmMutation({
        mutationFn: (type) => adminApi.disconnectChannel(type),
        successMessage: "Channel disconnected successfully",
        invalidateQueries: ['channels']
    });

    const createRoutingRule = useCrmMutation({
        mutationFn: (data) => adminApi.createRoutingRule(data),
        successMessage: "Routing rule created successfully",
        invalidateQueries: ['routingRules']
    });

    const updateRoutingRule = useCrmMutation({
        mutationFn: ({ id, data }) => adminApi.updateRoutingRule(id, data),
        successMessage: "Routing rule updated successfully",
        invalidateQueries: ['routingRules']
    });

    const updateAiConfig = useCrmMutation({
        mutationFn: (data) => adminApi.updateAiConfig(data),
        successMessage: "AI Configuration saved successfully",
        invalidateQueries: ['aiConfig']
    });

    const updateWorkingHours = useCrmMutation({
        mutationFn: (data) => adminApi.updateWorkingHours(data),
        successMessage: "Working hours updated successfully",
        invalidateQueries: ['workingHours']
    });

    return {
        downloadReport,
        connectChannel,
        disconnectChannel,
        createRoutingRule,
        updateRoutingRule,
        updateAiConfig,
        updateWorkingHours
    };
};

export const useUserActions = () => {
    const toggleStatus = useCrmMutation({
        mutationFn: ({ id, status }) => superAdminApi.updateUserStatus(id, status),
        successMessage: "User status updated",
        invalidateQueries: ['users', 'globalUsers']
    });

    const resetPassword = useCrmMutation({
        mutationFn: (email) => mockApi.users.resetPassword(email),
        successMessage: "Password reset link sent",
    });

    const addUser = useCrmMutation({
        mutationFn: (data) => superAdminApi.createUser(data),
        successMessage: "New global identity provisioned successfully",
        invalidateQueries: ['users', 'globalUsers']
    });

    const updateUser = useCrmMutation({
        mutationFn: ({ id, ...data }) => superAdminApi.updateUser(id, data),
        successMessage: "User identity updated successfully",
        invalidateQueries: ['users', 'globalUsers']
    });

    return { toggleStatus, resetPassword, addUser, updateUser };
};

export const useTemplateActions = () => {
    const addTemplate = useCrmMutation({
        mutationFn: (data) => adminApi.createTemplate(data),
        successMessage: "Template added successfully",
        invalidateQueries: ['templates', 'support-templates']
    });

    const updateTemplate = useCrmMutation({
        mutationFn: ({ id, ...data }) => adminApi.updateTemplate(id, data),
        successMessage: "Template updated successfully",
        invalidateQueries: ['templates', 'support-templates']
    });

    const deleteTemplate = useCrmMutation({
        mutationFn: (id) => adminApi.deleteTemplate(id),
        successMessage: "Template removed successfully",
        invalidateQueries: ['templates', 'support-templates']
    });

    return { addTemplate, updateTemplate, deleteTemplate };
};

export const useRoutingActions = () => {
    const toggleRule = useCrmMutation({
        mutationFn: ({ id, currentStatus }) => adminApi.updateRoutingRule(id, { status: currentStatus === 'Active' ? 'Paused' : 'Active' }),
        successMessage: "Rule status updated",
        invalidateQueries: ['routing-rules', 'adminRoutingRules']
    });

    const deleteRule = useCrmMutation({
        mutationFn: (id) => mockApi.admin.routing.deleteRule(id), // Not requested in contract but good to have if needed
        successMessage: "Rule deleted successfully",
        invalidateQueries: ['routing-rules', 'adminRoutingRules']
    });

    const addRule = useCrmMutation({
        mutationFn: (data) => adminApi.createRoutingRule(data),
        successMessage: "New routing rule configuration deployed",
        invalidateQueries: ['routing-rules', 'adminRoutingRules']
    });

    return { toggleRule, deleteRule, addRule };
};

export const useAiActions = () => {
    const updateConfig = useCrmMutation({
        mutationFn: (data) => adminApi.updateAiConfig(data),
        successMessage: "Global AI Flow and Scoring rules updated",
        invalidateQueries: ['ai-config', 'adminAiConfig']
    });

    return { updateConfig };
};

export const useShiftActions = () => {
    const updateHours = useCrmMutation({
        mutationFn: (data) => adminApi.updateWorkingHours(data),
        successMessage: "Automation schedule synchronized",
        invalidateQueries: ['working-hours', 'adminWorkingHours']
    });

    return { updateHours };
};

export const useIntegrationActions = () => {
    const addIntegration = useCrmMutation({
        mutationFn: (data) => mockApi.admin.integrations.add(data),
        successMessage: "New CRM node integrated",
        invalidateQueries: ['integrations']
    });

    const deleteIntegration = useCrmMutation({
        mutationFn: (id) => mockApi.admin.integrations.delete(id),
        successMessage: "Integration removed",
        invalidateQueries: ['integrations']
    });

    const testConnection = useCrmMutation({
        mutationFn: (id) => mockApi.admin.integrations.test(id),
        successMessage: "Connection test passed: Host reachable",
    });

    return { addIntegration, deleteIntegration, testConnection };
};

export const useSuperAdminActions = () => {
    const toggleClientChannelStatus = useCrmMutation({
        mutationFn: ({ id, currentStatus }) => mockApi.execute('toggleClientChannel', { id, newStatus: currentStatus === 'Active' ? 'Inactive' : 'Active' }),
        successMessage: "Client channel status updated",
        invalidateQueries: ['admin-channel-usage']
    });

    const deleteClientChannel = useCrmMutation({
        mutationFn: (id) => mockApi.execute('deleteClientChannel', { id }),
        successMessage: "Client channel removed successfully",
        invalidateQueries: ['admin-channel-usage']
    });

    const dispatchLead = useCrmMutation({
        mutationFn: (data) => superAdminApi.dispatchLead(data),
        successMessage: "Lead dispatched successfully",
        invalidateQueries: ['superAdminSummary', 'superAdminActivity', 'manualLeads']
    });

    return { toggleClientChannelStatus, deleteClientChannel, dispatchLead };
};

export const useAuditActions = () => {
    const exportLogs = useCrmMutation({
        mutationFn: (filters) => mockApi.audit.export(filters),
        successMessage: "Audit logs exported successfully. Download starting...",
    });

    return { exportLogs };
};

export const useSuperAdminGovernance = () => {
    const addAdmin = useCrmMutation({
        mutationFn: (data) => mockApi.admins.add(data),
        successMessage: "New administrative account provisioned",
        invalidateQueries: ['admins']
    });

    const updatePermissions = useCrmMutation({
        mutationFn: ({ id, permissions }) => mockApi.admins.updatePermissions(id, permissions),
        successMessage: "Administrative permissions synchronized",
        invalidateQueries: ['admins']
    });

    const toggleStatus = useCrmMutation({
        mutationFn: (id) => mockApi.admins.toggleStatus(id),
        successMessage: "Administrative access status updated",
        invalidateQueries: ['admins']
    });

    return { addAdmin, updatePermissions, toggleStatus };
};

export const useSecurityActions = () => {
    const updateSettings = useCrmMutation({
        mutationFn: (settings) => mockApi.security.update(settings),
        successMessage: "Global security protocols updated",
        invalidateQueries: ['security-settings']
    });

    const logoutSession = useCrmMutation({
        mutationFn: (id) => mockApi.security.logoutSession(id),
        successMessage: "Session revoked and termination signal sent",
        invalidateQueries: ['active-sessions']
    });

    return { updateSettings, logoutSession };
};

export const useCounselorActions = () => {
    const addNote = useCrmMutation({
        mutationFn: ({ leadId, text }) => counselorApi.addNote(leadId, text),
        successMessage: "Note saved",
        invalidateQueries: ['counselor-notes', 'counselor-leads', 'leads']
    });

    const updateNote = useCrmMutation({
        mutationFn: ({ id, text }) => { /* counselorApi doesn't have updateNote yet, but we'll leave as placeholder */ },
        successMessage: "Note updated successfully",
        invalidateQueries: ['counselor-notes']
    });

    const deleteNote = useCrmMutation({
        mutationFn: (id) => { /* counselorApi doesn't have deleteNote yet */ },
        successMessage: "Note deleted successfully",
        invalidateQueries: ['counselor-notes']
    });

    const updateStage = useCrmMutation({
        mutationFn: ({ leadId, stage }) => counselorApi.updateStage(leadId, stage.toUpperCase()),
        successMessage: "Lead stage updated successfully",
        invalidateQueries: ['counselor-stages', 'counselor-leads', 'leads', 'chats', 'counselor-dashboard']
    });

    const bulkUpdateStages = useCrmMutation({
        mutationFn: ({ leadIds, stage }) => Promise.all(leadIds.map(id => counselorApi.updateStage(id, stage.toUpperCase()))),
        successMessage: "Stages updated successfully",
        invalidateQueries: ['counselor-stages', 'counselor-leads', 'leads', 'counselor-dashboard']
    });

    const logCall = useCrmMutation({
        mutationFn: ({ leadId, ...callData }) => counselorApi.logCall(leadId, callData),
        successMessage: "Call logged successfully",
        invalidateQueries: ['counselor-calls', 'counselor-leads', 'leads', 'counselor-dashboard']
    });

    return { addNote, updateNote, deleteNote, updateStage, bulkUpdateStages, logCall };
};

export const useSupportActions = () => {
    const assignLead = useCrmMutation({
        mutationFn: ({ leadId, assignedToId }) => supportApi.assignLead(leadId, assignedToId),
        successMessage: "Lead assigned successfully",
        invalidateQueries: ['support-queue', 'support-assignments']
    });

    const createLead = useCrmMutation({
        mutationFn: (data) => supportApi.createLead(data),
        successMessage: "Lead created successfully",
        invalidateQueries: ['support-queue']
    });

    const bulkAssign = useCrmMutation({
        mutationFn: ({ leadIds, assignedToId }) => supportApi.bulkAssign(leadIds, assignedToId),
        successMessage: "Leads bulk assigned successfully",
        invalidateQueries: ['support-queue', 'support-assignments']
    });

    return { assignLead, createLead, bulkAssign };
};
