import React, { useState } from 'react'
import { Users, Flame, Calendar, Search, Filter, MessageSquare, MoreVertical, FileEdit, ExternalLink, Activity, Target, RefreshCcw, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useCounselorActions } from '../hooks/useCrmMutations'
import counselorApi from '../api/counselor.api.js'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const QuickStat = ({ title, value, icon: Icon, color, onClick }) => (
    <motion.div
        whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
        className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between group relative overflow-hidden shrink-0"
    >
        <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Icon size={120} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
            <div className={cn("p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110", color)}>
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

const CounselorDashboard = () => {
    const navigate = useNavigate()
    const { updateStage, addNote } = useCounselorActions()
    const [searchTerm, setSearchTerm] = useState('')
    const { setSelectedLeadId } = useStore()
    const [noteModalOpen, setNoteModalOpen] = useState(null)
    const [noteText, setNoteText] = useState('')

    // Fetch Stats
    const { data: dashboardData, refetch: refetchDash, isLoading: loadingDash } = useQuery({
        queryKey: ['counselor-dashboard'],
        queryFn: () => counselorApi.fetchDashboard()
    })

    // Fetch Leads
    const { data: myLeadsRes = [], refetch: refetchLeads, isLoading: loadingLeads } = useQuery({
        queryKey: ['counselor-leads'],
        queryFn: () => counselorApi.fetchLeads()
    })

    const leadsData = Array.isArray(myLeadsRes?.data) ? myLeadsRes.data : []
    const filteredLeads = leadsData.filter(l =>
        (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.program && l.program.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.country && l.country.toLowerCase().includes(searchTerm.toLowerCase()))
    ).map(l => ({
        ...l,
        lastActivity: new Date(l.createdAt).toLocaleDateString(),
        stage: l.stage.charAt(0) + l.stage.slice(1).toLowerCase() // Map back to Capitalized for the UI select
    }))

    const handleSaveNote = () => {
        if (!noteText.trim()) return;
        addNote.mutate({ leadId: noteModalOpen.id, text: noteText }, {
            onSuccess: () => {
                setNoteModalOpen(null);
                setNoteText('');
            }
        });
    }

    const openChat = (id) => {
        setSelectedLeadId(id);
        navigate('/inbox');
    }

    if (loadingDash || loadingLeads) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">My Workspace</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Manage your pipeline, engage leads, and track performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border text-gray-600 border-gray-200 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2">
                        <Filter size={14} /> Global Filters
                    </button>
                    <button className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                        <Calendar size={14} /> Schedule Follow-up
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickStat
                    title="Assigned Leads"
                    value={dashboardData?.data?.assignedLeads || 0}
                    icon={Users}
                    color="bg-indigo-50 text-indigo-600"
                    onClick={() => refetchDash()}
                />
                <QuickStat
                    title="Hot Leads"
                    value={dashboardData?.data?.hotLeads || 0}
                    icon={Flame}
                    color="bg-rose-50 text-rose-600"
                    onClick={() => refetchDash()}
                />
                <QuickStat
                    title="Action Pendings"
                    value={dashboardData?.data?.followUps || 0}
                    icon={Target}
                    color="bg-amber-50 text-amber-600"
                    onClick={() => refetchDash()}
                />
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-[#111827] uppercase tracking-widest text-xs">My Active Portfolio</h3>
                        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Sync</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:w-72">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads by name, country or program..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button onClick={() => refetchLeads()} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-indigo-600 shadow-sm">
                            <RefreshCcw size={16} className={loadingLeads ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FAFB]">
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Program Interest</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Source</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">AI Score</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lifecycle Stage</th>
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Last Comms</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            <AnimatePresence mode='popLayout'>
                                {filteredLeads.map((lead) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={lead.id}
                                        className="group hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-white text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm shrink-0">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-[#111827] group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-xs flex items-center gap-1.5">
                                                        {lead.name}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lead.country}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[#111827] font-black text-[11px] uppercase tracking-tight">{lead.program}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded inline-block">
                                                {lead.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {lead.score ? (
                                                <div className="flex items-center gap-3 w-24">
                                                    <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner flex shrink-0">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${lead.score}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className={cn(
                                                                "h-full",
                                                                lead.score > 80 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                                                    lead.score > 50 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                                        'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                                                            )}
                                                        />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-black",
                                                        lead.score > 80 ? 'text-rose-600' : lead.score > 50 ? 'text-amber-600' : 'text-indigo-600'
                                                    )}>{lead.score}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold uppercase italic tracking-widest animate-pulse">Analyzing</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <select
                                                value={lead.stage}
                                                onChange={(e) => updateStage.mutate({ leadId: lead.id, stage: e.target.value })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border appearance-none outline-none cursor-pointer transition-all focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500",
                                                    lead.stage === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100' :
                                                        lead.stage === 'Converted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-100' :
                                                            lead.stage === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-100' :
                                                                lead.stage === 'Lost' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300 hover:bg-rose-100' :
                                                                    'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300 hover:bg-amber-100'
                                                )}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Qualified">Qualified</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Lost">Lost</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                <Activity size={12} className="text-gray-300" />
                                                {lead.lastActivity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => openChat(lead.id)}
                                                    className="w-8 h-8 flex items-center justify-center border border-indigo-200 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all shadow-sm shrink-0"
                                                    title="Open in Unified Inbox"
                                                >
                                                    <MessageSquare size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setNoteModalOpen(lead)}
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm bg-white shrink-0"
                                                    title="Add Note"
                                                >
                                                    <FileEdit size={16} />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm bg-white shrink-0" title="View Profile">
                                                    <ExternalLink size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Search size={48} className="text-gray-300 mb-4" />
                                            <p className="text-gray-400 uppercase tracking-widest font-black text-xs">No leads in current pipeline.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Modal */}
            <AnimatePresence>
                {noteModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setNoteModalOpen(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight">Add Operational Note</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-indigo-600">Lead: {noteModalOpen.name}</p>
                            </div>
                            <div className="p-6">
                                <textarea
                                    className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm text-sm"
                                    placeholder="Enter internal progression notes here..."
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                />
                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        onClick={() => setNoteModalOpen(null)}
                                        className="px-5 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={addNote.isPending || !noteText.trim()}
                                        className="px-5 py-2.5 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {addNote.isPending ? <RefreshCcw size={14} className="animate-spin" /> : 'Save Note'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CounselorDashboard
