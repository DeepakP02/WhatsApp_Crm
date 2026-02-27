import React, { useState } from 'react'
import { Globe, Users, CreditCard, Activity, CheckCircle, Clock, Shield, Search, Filter, AlertTriangle, RefreshCw, MoreVertical, Eye, Trash2, ShieldOff, X, UserCheck, AlertCircle, SearchSlash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAdminActions, useSuperAdminActions } from '../../hooks/useCrmMutations'
import * as superAdminApi from '../../api/superAdmin.api.js'
import { formatCurrency } from '../../utils/formatters'

const AdminKPICard = ({ title, value, icon: Icon, color, subValue, trend, isRefetching }) => (
    <motion.div
        whileHover={{ scale: 1.02, translateY: -4 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E7EB] relative overflow-hidden flex flex-col gap-4 group transition-all hover:shadow-xl hover:shadow-indigo-50/50"
    >
        <div className="flex items-center justify-between">
            <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500", color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-end gap-1">
                {trend && (
                    <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider",
                        trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
                {isRefetching && <RefreshCw className="h-3 w-3 text-indigo-500 animate-spin" />}
            </div>
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-3xl font-black text-[#111827] mt-1 tracking-tighter">{value}</h3>
            {subValue && <div className="text-[10px] font-bold text-gray-500 mt-2 flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                {subValue}
            </div>}
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
            <Icon size={120} />
        </div>
    </motion.div>
)

const ActivityDetailModal = ({ activity, onClose }) => {
    if (!activity) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Activity Log Detail</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit Reference: #EXT-{Math.floor(Math.random() * 90000)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Action Executed</p>
                            <p className="text-sm font-black text-[#111827]">{activity.action}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Time Index</p>
                            <p className="text-sm font-black text-[#111827]">{activity.time}</p>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Actor Identity</span>
                            <span className="text-xs font-black text-indigo-600">{activity.user}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authority Role</span>
                            <span className="text-xs font-black text-gray-600 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">{activity.role}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Module</span>
                            <span className="text-xs font-black text-gray-600">{activity.module}</span>
                        </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                        <CheckCircle className="text-emerald-500" size={18} />
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Integrity Verified</p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <button onClick={onClose} className="w-full bg-[#111827] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Close Instance</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const Overview = () => {
    const queryClient = useQueryClient()
    const { downloadReport } = useAdminActions()
    const { toggleClientChannelStatus, deleteClientChannel } = useSuperAdminActions()

    const { dispatchLead } = useSuperAdminActions()

    const [assignmentSearch, setAssignmentSearch] = useState('')
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [selectedLead, setSelectedLead] = useState(null)
    const [assignmentData, setAssignmentData] = useState({ team: 'Global Operations', counselor: 'Unassigned', priority: 'Medium' })

    // Fetch Summary
    const { data: summary, refetch: refetchKpis, isRefetching: isRefetchingKpis, isLoading: isLoadingSummary, isError: isErrorSummary } = useQuery({
        queryKey: ['superAdminSummary'],
        queryFn: superAdminApi.fetchSuperAdminSummary
    })

    const kpiData = [
        { title: 'Active Users', value: summary?.activeUsers || 0, icon: Globe, color: 'bg-indigo-50 text-indigo-600' },
        { title: 'Total Leads', value: summary?.totalLeads?.toLocaleString() || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
        { title: 'Total Revenue', value: formatCurrency(summary?.totalRevenue || 0), icon: CreditCard, color: 'bg-emerald-50 text-emerald-600', subValue: 'Based on lead conversions' },
        { title: 'Conversion Rate', value: `${summary?.globalConversionRate || 0}%`, icon: CheckCircle, color: 'bg-rose-50 text-rose-600', subValue: `Active Channels: ${summary?.activeChannels || 0}` },
    ]

    // Fetch Activity
    const { data: activityLogs = [], isLoading: isLoadingActivity, isError: isErrorActivity } = useQuery({
        queryKey: ['superAdminActivity'],
        queryFn: superAdminApi.fetchSuperAdminActivity,
        refetchInterval: 30000
    })

    const timelineData = activityLogs.map(log => ({
        time: new Date(log.createdAt).toLocaleString(),
        user: log.user?.name || 'System',
        role: log.user?.role || 'SYSTEM',
        action: log.type,
        module: log.description.length > 30 ? log.description.substring(0, 30) + '...' : log.description,
        status: 'Success'
    }))

    // Fetch Manual Assignment Leads
    const { data: leadsData = [], isLoading: isLoadingLeads, isError: isErrorLeads } = useQuery({
        queryKey: ['manualLeads'],
        queryFn: superAdminApi.fetchManualLeads
    })

    const filteredLeads = leadsData.filter(l =>
        l.name.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
        l.country.toLowerCase().includes(assignmentSearch.toLowerCase())
    )

    const priorityColors = {
        'High': 'text-rose-600 bg-rose-50 border-rose-100',
        'Medium': 'text-amber-600 bg-amber-50 border-amber-100',
        'Low': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    }

    const handleConfirmDispatch = () => {
        if (!selectedLead) return;
        dispatchLead.mutate({ leadId: selectedLead.id, ...assignmentData }, {
            onSuccess: () => setSelectedLead(null)
        })
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Global Architecture Overview</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Centralized monitoring of tenant health, data throughput, and system-wide telemetry.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetchKpis()}
                        className={cn(
                            "p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-90",
                            isRefetchingKpis && "text-indigo-600 animate-spin"
                        )}
                    >
                        <RefreshCw size={20} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => downloadReport.mutate('global_overview')}
                        disabled={downloadReport.isPending}
                        className="px-8 py-4 bg-[#111827] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-indigo-100 flex items-center gap-3 active:scale-95"
                    >
                        {downloadReport.isPending ? <RefreshCw className="animate-spin" size={16} /> : <Activity size={16} strokeWidth={2.5} />}
                        {downloadReport.isPending ? 'Processing...' : 'Export Global Insight'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoadingSummary ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />
                    ))
                ) : isErrorSummary ? (
                    <div className="col-span-full p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center">
                        <p className="text-sm font-black text-rose-600 uppercase tracking-widest">Failed to retrieve telemetry data</p>
                        <button onClick={() => refetchKpis()} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Connection</button>
                    </div>
                ) : (
                    kpiData.map((kpi, index) => (
                        <AdminKPICard key={index} {...kpi} isRefetching={isRefetchingKpis} />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Timeline Column */}
                <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                    <div className="px-8 py-6 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-black text-[#111827] text-xs uppercase tracking-[0.2em]">Live Architecture Stream</h3>
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    </div>
                    <div className="flex-1 p-8">
                        {isLoadingActivity ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : isErrorActivity ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <AlertTriangle className="text-amber-500 mb-2" size={32} />
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Architecture stream offline</p>
                            </div>
                        ) : (
                            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                <AnimatePresence mode='popLayout'>
                                    {timelineData.map((item, i) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            onClick={() => setSelectedActivity(item)}
                                            className="relative pl-8 cursor-pointer group"
                                        >
                                            <div className={cn(
                                                "absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-125 duration-300",
                                                item.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'
                                            )} />
                                            <div className="p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs font-black text-[#111827] group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.action}</p>
                                                    <span className="text-[9px] text-gray-400 font-black uppercase text-right leading-none">
                                                        {item.time.split(',')[1]?.trim() || item.time}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.user}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-[8px] px-2 py-0.5 bg-gray-100 rounded-lg text-gray-400 font-black uppercase tracking-widest">{item.module}</span>
                                                    <span className="text-[8px] px-2 py-0.5 bg-indigo-50 text-indigo-400 rounded-lg font-black uppercase tracking-widest">{item.role}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {timelineData.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">No activities recorded</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Assignment Panel */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/50">
                        <div>
                            <h3 className="font-black text-[#111827] text-[14px] uppercase tracking-tight">Manual Assignment Panel</h3>
                            <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">Override routing rules and manually dispatch high-value leads.</p>
                        </div>
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Find leads requiring manual intervention..."
                                value={assignmentSearch}
                                onChange={(e) => setAssignmentSearch(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none w-full sm:w-80 transition-all"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F9FAFB]/50">
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] w-[25%]">Lead Profile</th>
                                    <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Current Status</th>
                                    <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Origin Source</th>
                                    <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] w-[20%]">AI Confidence</th>
                                    <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Target Deployment</th>
                                    <th className="px-8 py-5 text-right w-[15%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/50">
                                <AnimatePresence mode="popLayout">
                                    {isLoadingLeads ? (
                                        [...Array(3)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={6} className="px-8 py-6 h-20 bg-gray-50/50" />
                                            </tr>
                                        ))
                                    ) : isErrorLeads ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-12 text-center text-rose-500 font-black text-[10px] uppercase tracking-widest bg-rose-50/30">
                                                Protocol violation: Manual gate locked
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeads.map((lead) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={lead.id}
                                                className="hover:bg-gray-50/50 transition-all group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center font-black text-xs border border-gray-200 shrink-0 uppercase">
                                                            {(lead.name || 'U').charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col gap-1 min-w-0">
                                                            <div className="font-black text-xs text-[#111827] group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate">
                                                                {lead.name}
                                                            </div>
                                                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{lead.country}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                                                        lead.stage === 'HOT' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                            lead.stage === 'WARM' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                lead.stage === 'NEW' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                                    "bg-slate-50 text-slate-600 border-slate-200"
                                                    )}>
                                                        {lead.stage}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">{lead.source}</span>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-black text-[11px] text-[#111827] w-8">{lead.score || 0}%</div>
                                                        <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden w-16">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${lead.score || 0}%` }}
                                                                className={cn("h-full", (lead.score || 0) > 80 ? 'bg-emerald-500' : 'bg-amber-500')}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest whitespace-nowrap",
                                                        !lead.assignedToId ? "text-amber-500 animate-pulse" : "text-[#111827]"
                                                    )}>
                                                        {lead.assignedToId ? `ID: ${lead.assignedToId}` : 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => setSelectedLead(lead)}
                                                        className="px-5 py-2.5 bg-white border border-[#111827] text-[#111827] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111827] hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto shrink-0 group-hover:bg-[#111827] group-hover:text-white"
                                                    >
                                                        <UserCheck size={14} /> Dispatch
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                                {filteredLeads.length === 0 && !isLoadingLeads && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <SearchSlash size={48} className="text-gray-400 mb-4" />
                                                <p className="text-gray-500 uppercase tracking-widest font-black text-xs">No leads requiring assignment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selectedActivity && (
                    <ActivityDetailModal
                        activity={selectedActivity}
                        onClose={() => setSelectedActivity(null)}
                    />
                )}
                {selectedLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedLead(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                                    <AlertCircle size={18} className="text-indigo-600" /> Force Direct Assignment
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Target Identity</p>
                                        <p className="font-bold text-sm text-[#111827]">{selectedLead.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Confidence</p>
                                        <p className="font-bold text-sm text-[#111827]">{selectedLead.score || 0}%</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Operational Division</label>
                                        <select
                                            value={assignmentData.team}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, team: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option>Global Operations</option>
                                            <option>Admissions South</option>
                                            <option>Europe Direct</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Counselor Designation</label>
                                        <select
                                            value={assignmentData.counselor}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, counselor: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option>John Doe (Online)</option>
                                            <option>Sarah Johnson (Busy)</option>
                                            <option>Rahul K. (Offline)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Escalation Priority</label>
                                        <div className="flex gap-2">
                                            {['High', 'Medium', 'Low'].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setAssignmentData({ ...assignmentData, priority: p })}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                        assignmentData.priority === p ? priorityColors[p] : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={handleConfirmDispatch}
                                        disabled={dispatchLead.isPending}
                                        className="px-5 py-2.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Execute Transfer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Overview
