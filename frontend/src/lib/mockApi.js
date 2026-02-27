/**
 * Centralized Mock API utility for simulating backend interactions.
 * Uses a standard delay and random success/error rates for realism.
 */

const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    // Generic execute function to simulate mutations
    execute: async (action, data) => {
        console.log(`[Mock API] Executing ${action} with:`, data);
        await sleep(800);

        // Simulating a 5% error rate for robust error handling testing
        if (Math.random() < 0.05) {
            throw new Error(`Failed to ${action}. Please try again.`);
        }

        return { success: true, data, timestamp: new Date().toISOString() };
    },

    // Specific CRUD simulators
    leads: {
        updateStage: (id, stage) => mockApi.execute('updateLeadStage', { id, stage }),
        delete: (id) => mockApi.execute('deleteLead', { id }),
        assign: (leadId, counselorId) => mockApi.execute('assignLead', { leadId, counselorId }),
    },

    channels: {
        toggle: (id, currentStatus) => mockApi.execute('toggleChannel', { id, newStatus: currentStatus === 'Active' ? 'Inactive' : 'Active' }),
        delete: (id) => mockApi.execute('deleteChannel', { id }),
        add: (data) => mockApi.execute('addChannel', data),
    },

    billing: {
        upgrade: (clientId, plan) => mockApi.execute('upgradePlan', { clientId, plan }),
        suspend: (clientId) => mockApi.execute('suspendClient', { clientId }),
        addPlan: (data) => mockApi.execute('addPlan', data),
    },

    users: {
        toggleStatus: (id) => mockApi.execute('toggleUserStatus', { id }),
        resetPassword: (email) => mockApi.execute('resetPassword', { email }),
        delete: (id) => mockApi.execute('deleteUser', { id }),
        add: (data) => mockApi.execute('addUser', data),
        update: (id, data) => mockApi.execute('updateUser', { id, ...data }),
    },

    templates: {
        add: (data) => mockApi.execute('addTemplate', data),
        delete: (id) => mockApi.execute('deleteTemplate', { id }),
        update: (id, data) => mockApi.execute('updateTemplate', { id, ...data }),
    },

    audit: {
        export: (filters) => mockApi.execute('exportAuditLogs', filters),
    },

    analytics: {
        getSummary: () => mockApi.execute('getSystemAnalytics', {
            leadsByCountry: [
                { country: 'India', total: 24500, qualified: 8200 },
                { country: 'USA', total: 18200, qualified: 5400 },
                { country: 'UAE', total: 9500, qualified: 2800 },
                { country: 'UK', total: 4200, qualified: 1500 },
            ],
            leadsBySource: [
                { source: 'WhatsApp', total: 35400, converted: 8200 },
                { source: 'Facebook', total: 12500, converted: 3100 },
                { source: 'Website', total: 8500, converted: 2400 },
            ],
            activeUsers: [
                { role: 'Counselors', count: 142, activeToday: 135 },
                { role: 'Team Leaders', count: 24, activeToday: 24 },
                { role: 'Managers', count: 8, activeToday: 8 },
                { role: 'Support', count: 45, activeToday: 42 },
            ]
        }),
    },

    admins: {
        add: (data) => mockApi.execute('addAdmin', data),
        updatePermissions: (id, permissions) => mockApi.execute('updateAdminPermissions', { id, permissions }),
        toggleStatus: (id) => mockApi.execute('toggleAdminStatus', { id }),
    },

    security: {
        getSettings: () => mockApi.execute('getSecuritySettings', {
            force2FA: true,
            sessionTimeout: '30 mins',
            passwordPolicy: {
                minLength: 12,
                requireSpecialChar: true,
                expiryDays: 90
            },
            lastAudit: '2 hours ago'
        }),
        getActiveSessions: () => mockApi.execute('getActiveSessions', [
            { id: 'sess-1', user: 'Sarah Connor (sarah.c@educorp.com)', device: 'MacBook Pro / Chrome', location: 'San Francisco, USA', ip: '192.168.1.45', loginTime: '10 mins ago' },
            { id: 'sess-2', user: 'Marcus Wright (marcus@healthline.io)', device: 'iPhone 15 / Safari', location: 'London, UK', ip: '10.0.0.12', loginTime: '1 hour ago' },
            { id: 'sess-3', user: 'John Wick (john.w@global.connect)', device: 'Windows 11 / Edge', location: 'Berlin, DE', ip: '172.16.254.1', loginTime: '2 days ago' },
        ]),
        logoutSession: (id) => mockApi.execute('logoutSession', { id }),
        update: (settings) => mockApi.execute('updateSecuritySettings', settings),
    },

    admin: {
        getDashboard: () => mockApi.execute('getAdminDashboard', {
            whatsapp_count: 12,
            facebook_count: 8,
            website_leads_today: 142,
            routingPreview: [
                { country: 'India', team: 'Admissions', counselor: 'Rahul K.', type: 'Country', status: 'Active' },
                { country: 'USA', team: 'Sales', counselor: 'Sarah J.', type: 'Round Robin', status: 'Active' },
                { country: 'UK', team: 'Support', counselor: 'John D.', type: 'Load Based', status: 'Inactive' },
            ],
            aiStatus: { enabled: true, lastUpdated: '10 mins ago' }
        }),
        routing: {
            getRules: () => mockApi.execute('getRoutingRules', [
                { id: 1, country: 'India', team: 'Admissions', counselor: 'Rahul K.', type: 'Country', maxLoad: 50, status: 'Active' },
                { id: 2, country: 'USA', team: 'Sales', counselor: 'Sarah J.', type: 'Round Robin', maxLoad: 30, status: 'Active' },
            ]),
            updateRule: (id, data) => mockApi.execute('updateRoutingRule', { id, ...data }),
            deleteRule: (id) => mockApi.execute('deleteRoutingRule', { id }),
            addRule: (data) => mockApi.execute('addRoutingRule', data),
        },
        ai: {
            getConfig: () => mockApi.execute('getAIConfig', {
                questions: [
                    { id: 1, text: 'Which country are you from?', type: 'selection' },
                    { id: 2, text: 'Which program are you interested in?', type: 'selection' },
                ],
                scoring: [
                    { range: '0-30', category: 'Cold' },
                    { range: '31-70', category: 'Warm' },
                    { range: '71-100', category: 'Hot' },
                ],
                toggles: { autoAssign: true, aiEnabled: true }
            }),
            updateConfig: (data) => mockApi.execute('updateAIConfig', data),
        },
        integrations: {
            get: () => mockApi.execute('getIntegrations', [
                { id: 1, name: 'HubSpot', url: 'https://api.hubapi.com', status: 'Active' },
                { id: 2, name: 'Salesforce', url: 'https://salesforce.com/api', status: 'Inactive' },
            ]),
            add: (data) => mockApi.execute('addIntegration', data),
            delete: (id) => mockApi.execute('deleteIntegration', { id }),
            test: (id) => mockApi.execute('testIntegration', { id }),
        },
        workingHours: {
            get: () => mockApi.execute('getWorkingHours', [
                { day: 'Monday', start: '09:00', end: '18:00', autoAssign: true },
                { day: 'Tuesday', start: '09:00', end: '18:00', autoAssign: true },
            ]),
            update: (data) => mockApi.execute('updateWorkingHours', data),
        }
    },

    manager: {
        getDashboard: () => mockApi.execute('getManagerDashboard', {
            kpis: [
                { title: 'Leads Today', value: '452', subText: '+18.5%', type: 'leads_today' },
                { title: 'Qualified', value: '184', subText: '+12.3%', type: 'qualified_today' },
                { title: 'Converted', value: '56', subText: '+5.4%', type: 'converted_today' },
                { title: 'Enrolled', value: '12', subText: '+2.1%', type: 'enrolled_today' },
            ],
            funnelSummary: [
                { stage: 'New', total: 1245, conversion: '100%', dropoff: '0%' },
                { stage: 'Qualified', total: 452, conversion: '36.3%', dropoff: '63.7%' },
                { stage: 'Converted', total: 158, conversion: '12.7%', dropoff: '23.6%' },
                { stage: 'Enrolled', total: 45, conversion: '3.6%', dropoff: '9.1%' },
            ],
            countryPerformance: [
                { country: 'India', leads: 850, qualified: 310, converted: 85, enrolled: 45, teams: 4, responseTime: '2.4m' },
                { country: 'USA', leads: 420, qualified: 180, converted: 45, enrolled: 22, teams: 2, responseTime: '5.1m' },
                { country: 'UAE', leads: 280, qualified: 110, converted: 28, enrolled: 12, teams: 1, responseTime: '1.8m' },
                { country: 'UK', leads: 150, qualified: 65, converted: 15, enrolled: 8, teams: 1, responseTime: '4.2m' },
            ]
        }),
        getFunnelReport: () => mockApi.execute('getFunnelReport', [
            { stage: 'New', count: 1245, prevStagePct: '-', team: 'Admissions', avgTime: '2h 15m' },
            { stage: 'Qualified', count: 452, prevStagePct: '36.3%', team: 'Sales', avgTime: '1d 4h' },
            { stage: 'Converted', count: 158, prevStagePct: '34.9%', team: 'Finance', avgTime: '3d 2h' },
            { stage: 'Enrolled', count: 45, prevStagePct: '28.5%', team: 'Operations', avgTime: '1w 2d' },
        ]),
        getCountryAnalytics: () => mockApi.execute('getCountryAnalytics', [
            { country: 'India', total: 24500, qualified: 8200, converted: 3100, lost: 1200, topTeam: 'Team South', conversion: '12.6%' },
            { country: 'USA', total: 18200, qualified: 5400, converted: 2100, lost: 800, topTeam: 'Global Direct', conversion: '11.5%' },
            { country: 'UAE', total: 9500, qualified: 2800, converted: 1100, lost: 400, topTeam: 'Gulf Region', conversion: '11.6%' },
        ]),
        getSlaMetrics: () => mockApi.execute('getSlaMetrics', [
            { team: 'Team South', avgFirstResponse: '2.4m', avgResolution: '1d 4h', breaches: 4, compliance: '96.2%' },
            { team: 'Global Direct', avgFirstResponse: '5.1m', avgResolution: '2d 1h', breaches: 12, compliance: '88.5%' },
            { team: 'Gulf Region', avgFirstResponse: '1.8m', avgResolution: '18h 30m', breaches: 1, compliance: '99.1%' },
        ]),
        getConversionTracking: () => mockApi.execute('getConversionTracking', [
            { team: 'Admissions South', assigned: 1200, qualified: 450, converted: 120, enrolled: 85, conversion: '10.0%' },
            { team: 'Global Sales', assigned: 850, qualified: 310, converted: 85, enrolled: 45, conversion: '10.0%' },
            { team: 'Europe Support', assigned: 420, qualified: 180, converted: 45, enrolled: 22, conversion: '10.7%' },
        ]),
        getTeamOverview: () => mockApi.execute('getTeamOverview', [
            { team: 'Team South', activeLeads: 450, qualified: 180, converted: 56, avgResponse: '2.4m', counselors: 12 },
            { team: 'Global Direct', activeLeads: 320, qualified: 110, converted: 28, avgResponse: '5.1m', counselors: 8 },
            { team: 'Gulf Region', activeLeads: 180, qualified: 65, converted: 15, avgResponse: '1.8m', counselors: 5 },
        ]),
        getCallReports: () => mockApi.execute('getCallReports', [
            { id: 1, counselor: 'Rahul K.', lead: 'John Doe', country: 'India', duration: '12m 45s', outcome: 'Interested', date: '2024-02-20' },
            { id: 2, counselor: 'Sarah J.', lead: 'Jane Smith', country: 'USA', duration: '8m 20s', outcome: 'Follow-up', date: '2024-02-20' },
            { id: 3, counselor: 'Mike W.', lead: 'Ali Hassan', country: 'UAE', duration: '15m 10s', outcome: 'Converted', date: '2024-02-19' },
        ])
    },

    teamLeader: {
        getDashboard: () => mockApi.execute('getTeamLeaderDashboard', {
            teamLeads: '1,245',
            pendingReplies: '84',
            slaBreaches: '12',
        }),
        getInbox: () => mockApi.execute('getTeamInbox', [
            { id: 1, leadName: 'John Doe', country: 'India', counselor: 'Rahul K.', lastMessage: '10 mins ago', status: 'Pending', slaTimer: '50m' },
            { id: 2, leadName: 'Sarah Smith', country: 'USA', counselor: 'Jane D.', lastMessage: '2 hours ago', status: 'Replied', slaTimer: '-' },
            { id: 3, leadName: 'Ali Hassan', country: 'UAE', counselor: 'Mike W.', lastMessage: '15 mins ago', status: 'Pending', slaTimer: '45m' },
        ]),
        getLeads: () => mockApi.execute('getAssignedLeads', [
            { id: 101, leadName: 'Maria Garcia', country: 'Spain', source: 'WhatsApp', counselor: 'Carlos R.', status: 'New', lastActivity: '1 hr ago' },
            { id: 102, leadName: 'Kenji Sato', country: 'Japan', source: 'Website', counselor: 'Yuki T.', status: 'Contacted', lastActivity: '3 hrs ago' },
            { id: 103, leadName: 'Emma Brown', country: 'UK', source: 'Facebook', counselor: 'John D.', status: 'Qualified', lastActivity: 'Yesterday' },
        ]),
        getPerformance: () => mockApi.execute('getCounselorPerformance', [
            { counselor: 'Rahul K.', totalLeads: 150, replies: 420, conversions: 12, avgResponse: '5m', activeConv: 8 },
            { counselor: 'Jane D.', totalLeads: 120, replies: 380, conversions: 15, avgResponse: '3m', activeConv: 5 },
            { counselor: 'Mike W.', totalLeads: 90, replies: 210, conversions: 8, avgResponse: '12m', activeConv: 12 },
        ]),
        getReassignList: () => mockApi.execute('getReassignmentList', [
            { id: 201, leadName: 'Ahmed Ali', counselor: 'Mike W.', country: 'Egypt', status: 'New', lastActivity: '2 days ago' },
            { id: 202, leadName: 'Liu Wei', counselor: 'Rahul K.', country: 'China', status: 'Contacted', lastActivity: '1 day ago' },
        ]),
        getSlaAlerts: () => mockApi.execute('getSlaAlerts', [
            { id: 301, leadName: 'Sophie Turner', counselor: 'Jane D.', delay: 45, limit: 60, breachTime: '-', status: 'Warning' },
            { id: 302, leadName: 'Omar Farooq', counselor: 'Mike W.', delay: 120, limit: 60, breachTime: '1 hr ago', status: 'Breached' },
        ]),
        getActivityLogs: () => mockApi.execute('getActivityLogs', [
            { id: 401, date: '2024-02-20 10:30', user: 'Team Leader', action: 'Added Note', lead: 'General', note: 'Weekly review completed.' },
            { id: 402, date: '2024-02-20 09:15', user: 'Rahul K.', action: 'Status Update', lead: 'John Doe', note: 'Changed to Qualified' },
        ]),
        // Mutations
        sendReminder: (counselorId) => mockApi.execute('sendReminder', { counselorId }),
        reassignLead: (leadId, newCounselor) => mockApi.execute('reassignLead', { leadId, newCounselor }),
        updateLeadStatus: (leadId, status) => mockApi.execute('updateLeadStatus', { leadId, status }),
        addTeamNote: (noteData) => mockApi.execute('addTeamNote', noteData),
    },

    counselor: {
        getDashboard: () => mockApi.execute('getCounselorDashboard', {
            assignedLeads: 142,
            hotLeads: 24,
            followUps: 18,
        }),
        getLeads: () => mockApi.execute('getCounselorLeads', [
            { id: 101, name: 'Alice Johnson', country: 'India', source: 'WhatsApp', program: 'MBA Business Analysis', stage: 'Qualified', score: 85, lastActivity: '2 mins ago' },
            { id: 102, name: 'Bob Smith', country: 'USA', source: 'Facebook', program: 'MSc Data Science', stage: 'New', score: null, lastActivity: '1 hr ago' },
            { id: 103, name: 'Charlie Dean', country: 'UK', source: 'Website', program: 'BSc Computer Science', stage: 'Converted', score: 92, lastActivity: 'Yesterday' },
            { id: 104, name: 'Diana Prince', country: 'UAE', source: 'WhatsApp', program: 'MFA Digital Media', stage: 'Qualified', score: 78, lastActivity: '3 hrs ago' },
            { id: 105, name: 'Ethan Hunt', country: 'Canada', source: 'Facebook', program: 'BEng Mechanical', stage: 'Pending', score: 45, lastActivity: '4 hrs ago' },
        ]),
        getInbox: () => mockApi.execute('getCounselorInbox', [
            { id: 1, name: 'Alice Johnson', lastMsg: 'I have a question about the program.', time: '10:30 AM', status: 'Active', channel: 'WhatsApp', unread: 2, country: 'USA', program: 'MBA Business Analysis', score: 85 },
            { id: 2, name: 'Bob Smith', lastMsg: 'Thanks for the info!', time: 'Yesterday', status: 'Pending', channel: 'Facebook', unread: 0, country: 'India', program: 'MSc Data Science', score: 42 },
            { id: 3, name: 'Charlie Brown', lastMsg: 'When is the next session?', time: '2 days ago', status: 'Converted', channel: 'Website', unread: 0, country: 'UK', program: 'BSc Computer Science', score: 98 },
        ]),
        getLeadNotes: () => mockApi.execute('getLeadNotes', [
            { id: 1, leadId: 101, leadName: 'Alice Johnson', text: 'Interested in the September intake. High budget potential.', createdBy: 'Counselor Profile', date: '2024-02-20' },
            { id: 2, leadId: 102, leadName: 'Bob Smith', text: 'Needs clarification on visa requirements.', createdBy: 'Counselor Profile', date: '2024-02-19' },
        ]),
        getLeadStages: () => mockApi.execute('getLeadStages', [
            { id: 101, leadName: 'Alice Johnson', currentStage: 'Qualified', lastUpdated: '2 hours ago' },
            { id: 102, leadName: 'Bob Smith', currentStage: 'New', lastUpdated: '1 hour ago' },
            { id: 103, leadName: 'Charlie Dean', currentStage: 'Converted', lastUpdated: 'Yesterday' },
        ]),
        getAiSummary: () => mockApi.execute('getAiSummary', [
            { id: 101, leadName: 'Alice Johnson', country: 'India', program: 'MBA Business Analysis', budget: '$40,000', intake: 'Sep 2024', score: 85, category: 'Hot' },
            { id: 102, leadName: 'Bob Smith', country: 'USA', program: 'MSc Data Science', budget: '$25,000', intake: 'Jan 2025', score: 42, category: 'Cold' },
            { id: 104, leadName: 'Diana Prince', country: 'UAE', program: 'MFA Digital Media', budget: '$50,000+', intake: 'Sep 2024', score: 78, category: 'Warm' },
        ]),
        getCalls: () => mockApi.execute('getCounselorCalls', [
            { id: 1, date: '2024-02-20', time: '14:30', type: 'Outgoing', duration: '12m 45s', status: 'Connected', lead: 'Alice Johnson', notes: 'Discussed scholarship options.' },
            { id: 2, date: '2024-02-20', time: '11:15', type: 'Incoming', duration: '05m 20s', status: 'Missed', lead: 'Bob Smith', notes: 'Left a voicemail.' },
            { id: 3, date: '2024-02-19', time: '16:45', type: 'Outgoing', duration: '08m 10s', status: 'Connected', lead: 'Diana Prince', notes: 'Highly qualified. Sent application form.' },
        ]),
        // Mutations
        addNote: (noteData) => mockApi.execute('addCounselorNote', noteData),
        updateNote: (id, noteText) => mockApi.execute('updateCounselorNote', { id, noteText }),
        deleteNote: (id) => mockApi.execute('deleteCounselorNote', { id }),
        updateStage: (leadId, newStage) => mockApi.execute('updateCounselorLeadStage', { leadId, newStage }),
        bulkUpdateStages: (leadIds, newStage) => mockApi.execute('bulkUpdateStages', { leadIds, newStage }),
        logCall: (callData) => mockApi.execute('logCounselorCall', callData),
    },

    support: {
        getDashboard: () => mockApi.execute('getSupportDashboard', {
            newMessages: 48,
            unassignedLeads: 12,
            aiActiveChats: 34,
        }),
        getNewLeads: () => mockApi.execute('getSupportNewLeads', [
            { id: 201, name: 'Michael Chen', source: 'WhatsApp', country: 'Singapore', receivedTime: '10 mins ago', score: 82, status: 'Unassigned' },
            { id: 202, name: 'Sarah Miller', source: 'Facebook Messenger', country: 'USA', receivedTime: '25 mins ago', score: 45, status: 'Unassigned' },
            { id: 203, name: 'Ahmed Khan', source: 'Website Widget', country: 'UAE', receivedTime: '1 hr ago', score: 91, status: 'Unassigned' },
            { id: 204, name: 'Elena Rossi', source: 'WhatsApp', country: 'Italy', receivedTime: '2 hrs ago', score: null, status: 'Unassigned' },
        ]),
        getAssignmentList: () => mockApi.execute('getSupportAssignmentList', [
            { id: 201, name: 'Michael Chen', status: 'Hot', source: 'WhatsApp', country: 'Singapore', score: 82, assignedTo: 'Pending' },
            { id: 202, name: 'Sarah Miller', status: 'Cold', source: 'Facebook Messenger', country: 'USA', score: 45, assignedTo: 'Pending' },
            { id: 205, name: 'David Kim', status: 'Warm', source: 'Website Widget', country: 'South Korea', score: 65, assignedTo: 'Global Direct Team' },
        ]),
        getAiStatus: () => mockApi.execute('getSupportAiStatus', [
            { id: 301, name: 'Michael Chen', score: 82, category: 'Hot', status: 'Qualified', program: 'MBA Global', budget: '$45k', intake: '2024' },
            { id: 302, name: 'Ahmed Khan', score: 91, category: 'Hot', status: 'High Intent', program: 'MSc Data Science', budget: '$30k', intake: '2025' },
            { id: 303, name: 'Sarah Miller', score: 45, category: 'Cold', status: 'Processing', program: 'Undecided', budget: 'low', intake: 'None' },
        ]),
        getTemplates: () => mockApi.execute('getSupportTemplates', [
            { id: 1, name: 'Greeting', channel: 'WhatsApp', preview: 'Hi there! How can I help you today?', createdBy: 'Admin', date: '2024-01-10' },
            { id: 2, name: 'Pricing Info', channel: 'Facebook', preview: 'Our pricing starts at $99/mo depending on...', createdBy: 'Sarah J.', date: '2024-02-15' },
        ]),
        // Mutations
        assignLead: (data) => mockApi.execute('supportAssignLead', data),
        createLead: (data) => mockApi.execute('supportCreateLead', data),
        bulkAssign: (data) => mockApi.execute('supportBulkAssign', data),
    }
};

export default mockApi;
