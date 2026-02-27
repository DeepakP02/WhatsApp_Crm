import axios from '../api/axios'

const supportApi = {
    fetchDashboard: async () => {
        const response = await axios.get('/dashboard')
        return response.data
    },

    fetchUnassignedLeads: async () => {
        const response = await axios.get('/leads?unassigned=true')
        return response.data
    },

    fetchCounselors: async () => {
        const response = await axios.get('/users?role=COUNSELOR')
        return response.data
    },

    assignLead: async (leadId, assignedToId) => {
        const response = await axios.put(`/leads/${leadId}/assign`, { assignedToId })
        return response.data
    },

    bulkAssign: async (leadIds, assignedToId) => {
        const response = await axios.post('/leads/bulk-assign', { leadIds, assignedToId })
        return response.data
    },

    createLead: async (leadData) => {
        const response = await axios.post('/leads', leadData)
        return response.data
    }
}

export default supportApi
