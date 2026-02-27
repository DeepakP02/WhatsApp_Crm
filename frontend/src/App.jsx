import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PageLayout from './components/layout/PageLayout'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Inbox from './pages/Inbox'
import AIQualification from './pages/AIQualification'
import SuperAdminOverview from './pages/super-admin/Overview'
import ChannelsControl from './pages/super-admin/ChannelsControl'
import BillingPlans from './pages/super-admin/BillingPlans'
import AuditLogs from './pages/super-admin/AuditLogs'
import GlobalUsers from './pages/super-admin/GlobalUsers'
import SystemAnalytics from './pages/super-admin/SystemAnalytics'
import AdminManagement from './pages/super-admin/AdminManagement'
import SecuritySettings from './pages/super-admin/SecuritySettings'
import AdminDashboard from './pages/AdminDashboard'
import RoutingRules from './pages/RoutingRules'
import UserManagement from './pages/UserManagement'
import AdminAIConfig from './pages/AdminAIConfig'
import WorkingHours from './pages/WorkingHours'
import ChannelSetup from './pages/admin/ChannelSetup'
import CrmIntegration from './pages/CrmIntegration'
import ManagerDashboard from './pages/manager/Dashboard'
import LeadFunnel from './pages/manager/LeadFunnel'
import CountryAnalytics from './pages/manager/CountryAnalytics'
import SlaMetrics from './pages/manager/SlaMetrics'
import ConversionTracking from './pages/manager/ConversionTracking'
import TeamOverview from './pages/manager/TeamOverview'
import CallReports from './pages/manager/CallReports'
import TeamLeaderDashboard from './pages/TeamLeaderDashboard'
import TeamInbox from './pages/team-leader/TeamInbox'
import AssignedLeads from './pages/team-leader/AssignedLeads'
import CounselorPerformance from './pages/team-leader/CounselorPerformance'
import ReassignLeads from './pages/team-leader/ReassignLeads'
import SlaAlerts from './pages/team-leader/SlaAlerts'
import ActivityLogs from './pages/team-leader/ActivityLogs'
import CounselorDashboard from './pages/CounselorDashboard'
import LeadNotes from './pages/counselor/LeadNotes'
import LeadStages from './pages/counselor/LeadStages'
import AISummaryView from './pages/counselor/AISummaryView'
import CallLogging from './pages/CallLogging'
import SupportDashboard from './pages/support/SupportDashboard'
import LeadAssignment from './pages/support/LeadAssignment'
import AiStatus from './pages/support/AiStatus'
import TemplatesLibrary from './pages/TemplatesLibrary'
import LoginPage from './pages/auth/LoginPage'
import useStore from './store/useStore'
import { ToastContainer } from './components/ui/Toast'

const queryClient = new QueryClient()
const RoleBasedRedirect = () => {
  const { role } = useStore()

  const roleRoutes = {
    'SUPER_ADMIN': '/super-admin',
    'ADMIN': '/admin',
    'MANAGER': '/manager',
    'TEAM_LEADER': '/team-leader',
    'COUNSELOR': '/counselor',
    'CUSTOMER_SUPPORT': '/support',
    'Super Admin': '/super-admin',
    'Admin': '/admin',
    'Manager': '/manager',
    'Team Leader': '/team-leader',
    'Counselor': '/counselor',
    'Customer Support': '/support'
  }

  return <Navigate to={roleRoutes[role] || '/'} replace />
}

function App() {
  const { isAuthenticated } = useStore()

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<LoginPage />} />
          ) : (
            <Route
              path="*"
              element={
                <PageLayout>
                  <Routes>
                    <Route path="/" element={<RoleBasedRedirect />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/ai-qualification" element={<AIQualification />} />
                    <Route path="/super-admin" element={<SuperAdminOverview />} />
                    <Route path="/super-admin/channels" element={<ChannelsControl />} />
                    <Route path="/super-admin/billing" element={<BillingPlans />} />
                    <Route path="/super-admin/audit" element={<AuditLogs />} />
                    <Route path="/super-admin/users" element={<GlobalUsers />} />
                    <Route path="/super-admin/analytics" element={<SystemAnalytics />} />
                    <Route path="/super-admin/admins" element={<AdminManagement />} />
                    <Route path="/super-admin/security" element={<SecuritySettings />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/channels" element={<ChannelSetup />} />
                    <Route path="/admin/routing" element={<RoutingRules />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/ai-config" element={<AdminAIConfig />} />
                    <Route path="/admin/crm-settings" element={<CrmIntegration />} />
                    <Route path="/admin/working-hours" element={<WorkingHours />} />

                    {/* Manager Routes */}
                    <Route path="/manager" element={<ManagerDashboard />} />
                    <Route path="/manager/funnel" element={<LeadFunnel />} />
                    <Route path="/manager/country" element={<CountryAnalytics />} />
                    <Route path="/manager/sla" element={<SlaMetrics />} />
                    <Route path="/manager/conversion" element={<ConversionTracking />} />
                    <Route path="/manager/team" element={<TeamOverview />} />
                    <Route path="/manager/calls" element={<CallReports />} />

                    {/* Team Leader Routes */}
                    <Route path="/team-leader" element={<TeamLeaderDashboard />} />
                    <Route path="/team-leader/inbox" element={<TeamInbox />} />
                    <Route path="/team-leader/leads" element={<AssignedLeads />} />
                    <Route path="/team-leader/performance" element={<CounselorPerformance />} />
                    <Route path="/team-leader/reassign" element={<ReassignLeads />} />
                    <Route path="/team-leader/sla" element={<SlaAlerts />} />
                    <Route path="/team-leader/logs" element={<ActivityLogs />} />

                    {/* Counselor Routes */}
                    <Route path="/counselor" element={<CounselorDashboard />} />
                    <Route path="/counselor/notes" element={<LeadNotes />} />
                    <Route path="/counselor/stages" element={<LeadStages />} />
                    <Route path="/counselor/ai-summary" element={<AISummaryView />} />
                    <Route path="/counselor/calls" element={<CallLogging />} />

                    {/* Customer Support Routes */}
                    <Route path="/support" element={<SupportDashboard />} />
                    <Route path="/support/assign" element={<LeadAssignment />} />
                    <Route path="/support/ai-status" element={<AiStatus />} />
                    <Route path="/support/templates" element={<TemplatesLibrary />} />

                    <Route path="/calls" element={<div className="text-center py-20 text-gray-500">Calls Page (Work in Progress)</div>} />
                    <Route path="/analytics" element={<div className="text-center py-20 text-gray-500">Analytics Page (Work in Progress)</div>} />
                    <Route path="/settings" element={<div className="text-center py-20 text-gray-500">Settings Page (Work in Progress)</div>} />
                  </Routes>
                </PageLayout>
              }
            />
          )}
        </Routes>
        <ToastContainer />
      </Router>
    </QueryClientProvider>
  )
}

export default App
