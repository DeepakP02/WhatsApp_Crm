import React from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    MessageSquare,
    AlertTriangle,
    RefreshCcw,
    TrendingUp,
    Clock,
    ChevronRight,
    UserCheck,
    FileText
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useTeamLeaderActions } from '../hooks/useTeamLeaderActions'
import { useNavigate } from 'react-router-dom'

const KpiCard = ({ title, value, subText, icon: Icon, color, onRefresh }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4 group relative overflow-hidden"
    >
        <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Icon size={120} />
        </div>
        <div className="flex items-center justify-between relative z-10">
            <div className={cn("p-2.5 rounded-xl", color)}>
                <Icon size={20} className="text-current" />
            </div>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 bg-gray-50 border border-gray-100/50 rounded-lg transition-all"
                >
                    <RefreshCcw size={14} />
                </button>
            )}
        </div>
        <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-end gap-3">
                <h3 className="text-3xl font-black text-[#111827] tracking-tighter">{value}</h3>
                {subText && (
                    <span className="text-xs font-bold text-emerald-500 mb-1 flex items-center gap-0.5">
                        <TrendingUp size={12} /> {subText}
                    </span>
                )}
            </div>
        </div>
    </motion.div>
)

const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm text-left flex items-start gap-4 hover:border-indigo-200 transition-colors group"
    >
        <div className={cn("p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-3", color)}>
            <Icon size={20} className="text-current" />
        </div>
        <div>
            <h4 className="text-sm font-black text-[#111827] uppercase tracking-tight">{title}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 leading-relaxed">{description}</p>
        </div>
        <div className="ml-auto mt-2 text-gray-300 group-hover:text-indigo-600 transition-colors">
            <ChevronRight size={16} />
        </div>
    </motion.button>
)

const TeamLeaderDashboard = () => {
    const { useDashboard, useActivityLogs, refreshData } = useTeamLeaderActions()
    const { data: dashboard, isLoading } = useDashboard()
    const { data: logs } = useActivityLogs({ limit: 3 })
    const refreshDash = refreshData('dashboard')
    const navigate = useNavigate()

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const stats = dashboard?.data || { teamLeads: '0', pendingReplies: '0', slaBreaches: '0' }
    const recentLogs = logs?.data || []

    return (
        <div className="space-y-8 pb-12">
            {/* ... Rest of header and KPI grid ... */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Team Control <span className="text-indigo-600">Center</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live operational metrics and management</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refreshDash.mutate()}
                        className="bg-white border border-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <RefreshCcw size={14} className={refreshDash.isPending ? "animate-spin" : ""} /> Sync Data
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="My Team Leads"
                    value={stats.teamLeads}
                    icon={Users}
                    color="bg-indigo-50 text-indigo-600"
                    onRefresh={() => refreshDash.mutate()}
                />
                <KpiCard
                    title="Pending Replies"
                    value={stats.pendingReplies}
                    icon={MessageSquare}
                    color="bg-amber-50 text-amber-600"
                    onRefresh={() => refreshDash.mutate()}
                />
                <KpiCard
                    title="SLA Breaches"
                    value={stats.slaBreaches}
                    icon={AlertTriangle}
                    color="bg-rose-50 text-rose-600"
                    onRefresh={() => refreshDash.mutate()}
                />
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Command Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Inbox Monitor"
                        description="View all active team conversations and send reminder pings."
                        icon={MessageSquare}
                        color="bg-blue-50 text-blue-600"
                        onClick={() => navigate('/team-leader/inbox')}
                    />
                    <QuickActionCard
                        title="Assigned Leads"
                        description="Manage team portfolio, update statuses, and add internal notes."
                        icon={Users}
                        color="bg-emerald-50 text-emerald-600"
                        onClick={() => navigate('/team-leader/leads')}
                    />
                    <QuickActionCard
                        title="Counselor Perf."
                        description="Track individual metrics, conversions, and SLA averages."
                        icon={TrendingUp}
                        color="bg-purple-50 text-purple-600"
                        onClick={() => navigate('/team-leader/performance')}
                    />
                    <QuickActionCard
                        title="Reassign Leads"
                        description="Perform single or bulk lead transfers between team members."
                        icon={UserCheck}
                        color="bg-orange-50 text-orange-600"
                        onClick={() => navigate('/team-leader/reassign')}
                    />
                    <QuickActionCard
                        title="SLA Alerts"
                        description="Respond to delayed responses and force emergency transfers."
                        icon={AlertTriangle}
                        color="bg-rose-50 text-rose-600"
                        onClick={() => navigate('/team-leader/sla')}
                    />
                    <QuickActionCard
                        title="Activity Logs"
                        description="Audit team actions and add global protocol records."
                        icon={FileText}
                        color="bg-gray-100/80 text-gray-600"
                        onClick={() => navigate('/team-leader/logs')}
                    />
                </div>
            </div>

            {/* Team Activity Feed (Compact) */}
            <div className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-[#111827] uppercase tracking-tighter">Live Operations Feed</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time team activity</p>
                    </div>
                    <button
                        onClick={() => navigate('/team-leader/logs')}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center gap-1"
                    >
                        View Full Ledger <ChevronRight size={12} />
                    </button>
                </div>

                <div className="space-y-6">
                    {recentLogs.map((log, i) => (
                        <div key={i} className="flex gap-4 items-start relative before:absolute before:inset-y-[24px] before:left-[11px] before:w-px before:bg-gray-100 last:before:hidden">
                            <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 text-indigo-600">
                                <Clock size={10} />
                            </div>
                            <div className="space-y-1 pb-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-[11px] font-black text-[#111827] uppercase tracking-tight">
                                        {log.user?.name || 'User'} {log.action}
                                    </h4>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    {log.module}: {typeof log.details === 'string' ? log.details : (log.details?.note || log.action)}
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentLogs.length === 0 && (
                        <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest py-10">No recent operations detected</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TeamLeaderDashboard
