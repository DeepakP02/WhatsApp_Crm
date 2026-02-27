import React, { useState } from 'react'
import { MessageSquare, UserPlus, Zap, Filter, Search, UserCheck, RefreshCcw, MoreVertical, LayoutGrid, CheckSquare, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSupportActions } from '../../hooks/useCrmMutations'
import supportApi from '../../api/support.api'
import { toast } from '../../components/ui/Toast'

const QuickStat = ({ title, value, icon: Icon, color, onClick }) => (
    <motion.div
        whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
        className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between group relative overflow-hidden"
    >
        <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Icon size={120} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
            <div className={cn("p-4 rounded-xl shadow-sm transition-transform group-hover:scale-110", color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-[#111827] mt-1">{value}</h3>
            </div>
        </div>
        <button
            onClick={onClick}
            className="p-1.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative z-10 h-max self-start"
            title="Refresh Data"
        >
            <RefreshCcw size={14} />
        </button>
    </motion.div>
)

const SupportDashboard = () => {
    const { bulkAssign } = useSupportActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLeads, setSelectedLeads] = useState([])
    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
    const [assignmentData, setAssignmentData] = useState({ team: '', counselor: '', priority: 'Medium' })

    const { data: dashboardData, refetch: refetchDash } = useQuery({
        queryKey: ['support-dashboard'],
        queryFn: () => supportApi.fetchDashboard()
    })

    const { data: queueResp, refetch: refetchQueue, isLoading } = useQuery({
        queryKey: ['support-queue'],
        queryFn: () => supportApi.fetchUnassignedLeads()
    })

    const queueData = Array.isArray(queueResp?.data) ? queueResp.data : []
    const kpis = dashboardData?.data || { newMessages: 0, unassignedLeads: 0, aiActiveChats: 0 }

    const filteredQueue = queueData.filter(l =>
        (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.country && l.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.source && l.source.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const toggleSelect = (id) => {
        setSelectedLeads(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        if (selectedLeads.length === filteredQueue.length) {
            setSelectedLeads([])
        } else {
            setSelectedLeads(filteredQueue.map(l => l.id))
        }
    }

    const { data: counselorsResp } = useQuery({
        queryKey: ['counselors-list'],
        queryFn: () => supportApi.fetchCounselors()
    })
    const counselors = counselorsResp?.data || []

    const handleBulkAssign = () => {
        if (selectedLeads.length === 0 || !assignmentData.counselor) return;
        bulkAssign.mutate({
            leadIds: selectedLeads,
            assignedToId: Number(assignmentData.counselor)
        }, {
            onSuccess: () => {
                setAssignmentModalOpen(false)
                setSelectedLeads([])
            }
        })
    }

    const handleSingleAssign = (lead) => {
        setSelectedLeads([lead.id])
        setAssignmentModalOpen(true)
    }

    const convertToCrm = (lead) => {
        toast.success(`${lead.name} mapped to CRM ecosystem rules successfully`)
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">New Leads Queue</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Manage unassigned leads and orchestrate routing protocols.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button className="bg-white border border-[#E5E7EB] px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-[#111827] shadow-sm hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center gap-2">
                        <Filter size={16} className="text-indigo-400" /> Filter Queue
                    </button>
                    {selectedLeads.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setAssignmentModalOpen(true)}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2"
                        >
                            <UserCheck size={16} /> Bulk Assign ({selectedLeads.length})
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickStat
                    title="New Messages"
                    value={kpis.newMessages}
                    icon={MessageSquare}
                    color="bg-indigo-50 text-indigo-600"
                    onClick={() => refetchDash()}
                />
                <QuickStat
                    title="Unassigned Leads"
                    value={kpis.unassignedLeads}
                    icon={UserPlus}
                    color="bg-rose-50 text-rose-600"
                    onClick={() => refetchDash()}
                />
                <QuickStat
                    title="AI Active Chats"
                    value={kpis.aiActiveChats}
                    icon={Zap}
                    color="bg-emerald-50 text-emerald-600"
                    onClick={() => refetchDash()}
                />
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-[#111827] text-xs uppercase tracking-widest">Inbound Triage</h3>
                        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
                        <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100 animate-pulse flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Live Polling
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:w-72">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, source or country..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button onClick={() => refetchQueue()} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-indigo-600 shadow-sm">
                            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar min-h-[300px]">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]">
                                <th className="pl-6 pr-2 py-4 w-10">
                                    <button onClick={toggleSelectAll} className="p-1 rounded text-gray-400 hover:text-indigo-600 transition-colors">
                                        <CheckSquare size={16} className={selectedLeads.length === filteredQueue.length && filteredQueue.length > 0 ? "text-indigo-600" : ""} />
                                    </button>
                                </th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Source</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Received Time</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">AI Score</th>
                                <th className="px-4 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            <AnimatePresence>
                                {filteredQueue.map((lead) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={lead.id}
                                        className={cn(
                                            "group transition-colors",
                                            selectedLeads.includes(lead.id) ? "bg-indigo-50/50" : "hover:bg-gray-50/50"
                                        )}
                                    >
                                        <td className="pl-6 pr-2 py-5">
                                            <button onClick={() => toggleSelect(lead.id)} className="p-1 rounded text-gray-400 hover:text-indigo-600 transition-colors">
                                                <CheckSquare size={16} className={selectedLeads.includes(lead.id) ? "text-indigo-600" : ""} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs border border-indigo-100 shadow-sm shrink-0">
                                                    {(lead.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-[#111827] uppercase tracking-tight text-xs flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors cursor-pointer">
                                                        {lead.name}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{lead.country}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded inline-block">
                                                {lead.source}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-black text-[#111827] uppercase tracking-tight">{lead.receivedTime}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            {lead.score ? (
                                                <div className="flex items-center gap-2 w-20">
                                                    <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner flex shrink-0">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${lead.score}%` }}
                                                            className={cn("h-full", lead.score > 80 ? 'bg-emerald-500' : 'bg-amber-500')}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-black text-gray-600">{lead.score}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic animate-pulse flex items-center gap-1"><Sparkles size={10} /> Active</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button onClick={() => handleSingleAssign(lead)} className="px-3 py-1.5 bg-[#111827] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5">
                                                    <UserCheck size={12} /> Assign
                                                </button>
                                                <button onClick={() => convertToCrm(lead)} className="px-4 py-2 border border-indigo-100 bg-indigo-50 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm uppercase text-[10px] font-black tracking-widest inline-flex items-center gap-1">
                                                    Convert
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredQueue.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <LayoutGrid size={48} className="text-gray-300 mb-4" />
                                            <p className="text-gray-400 uppercase tracking-widest font-black text-xs">Queue is clear.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Modal */}
            <AnimatePresence>
                {assignmentModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setAssignmentModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                                    <UserCheck size={18} className="text-indigo-600" /> Lead Redistribution
                                </h2>
                            </div>
                            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Target Selection</p>
                                    <p className="font-bold text-sm text-[#111827]">{selectedLeads.length} Lead(s) Selected for Assignment</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Division</label>
                                        <select
                                            value={assignmentData.team}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, team: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option>Global Direct Team</option>
                                            <option>South East Asia Division</option>
                                            <option>Europe Operations</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Active Counselor</label>
                                        <select
                                            value={assignmentData.counselor}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, counselor: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option value="">Select Counselor</option>
                                            {counselors.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        onClick={() => setAssignmentModalOpen(false)}
                                        className="px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBulkAssign}
                                        disabled={bulkAssign.isPending}
                                        className="px-5 py-2.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        Confirm Transfer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SupportDashboard
