import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Search,
    Filter,
    Clock,
    User,
    Globe,
    FileText,
    MessageSquare,
    ChevronRight,
    RefreshCcw,
    X,
    MoreVertical,
    CheckCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTeamLeaderActions } from '../../hooks/useTeamLeaderActions'

const STATUS_CONFIG = {
    'New': { color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    'Contacted': { color: 'bg-blue-50 text-blue-600 border-blue-100' },
    'Qualified': { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    'Converted': { color: 'bg-amber-50 text-amber-600 border-amber-100' },
    'Lost': { color: 'bg-rose-50 text-rose-600 border-rose-100' }
}

const AssignedLeads = () => {
    const { useLeads, updateLeadStatus, addTeamNote, refreshData } = useTeamLeaderActions()
    const { data: leads, isLoading } = useLeads()
    const refreshLeads = refreshData('leads')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLead, setSelectedLead] = useState(null)
    const [noteModalOpen, setNoteModalOpen] = useState(false)
    const [activeNoteLead, setActiveNoteLead] = useState(null)
    const [noteText, setNoteText] = useState('')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const assignedLeads = leads?.data || []
    const filteredLeads = assignedLeads.filter(l =>
        l.leadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.counselor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.country?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleStatusChange = (leadId, newStatus) => {
        updateLeadStatus.mutate({ leadId, status: newStatus })
    }

    const handleSaveNote = () => {
        if (!noteText.trim()) return
        addTeamNote.mutate({
            lead: activeNoteLead ? activeNoteLead.leadName : 'General',
            note: noteText
        })
        setNoteModalOpen(false)
        setNoteText('')
        setActiveNoteLead(null)
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Assigned <span className="text-indigo-600">Leads</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Team portfolio and status management</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm hidden sm:flex">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Status / Source Filter</span>
                    </div>
                    <button
                        onClick={() => refreshLeads.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} className={refreshLeads.isPending ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => {
                            setActiveNoteLead(null)
                            setNoteModalOpen(true)
                        }}
                        className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-100/20"
                    >
                        <FileText size={14} />
                        Add Team Note
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH PORTFOLIO..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm whitespace-nowrap">
                        <Users size={14} />
                        {assignedLeads.length} Total Assigned Leads
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Source</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Status Guard</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Activity Log</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredLeads.map((lead, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{lead.leadName}</span>
                                                {lead.status === 'New' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                                                <Globe size={10} /> {lead.country}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            {lead.source === 'WhatsApp' ? <MessageSquare size={14} className="text-emerald-500" /> :
                                                lead.source === 'Facebook' ? <Globe size={14} className="text-blue-500" /> :
                                                    <Globe size={14} className="text-gray-400" />}
                                            <span className="text-[10px] font-black uppercase">{lead.source}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                                                {(lead.counselor || 'U').charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-black text-[#111827] uppercase">{lead.counselor}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className={cn(
                                                "w-36 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer border shadow-sm transition-all appearance-none",
                                                STATUS_CONFIG[lead.status]?.color || "bg-gray-50 border-gray-100 text-gray-600"
                                            )}
                                        >
                                            {Object.keys(STATUS_CONFIG).map((s) => (
                                                <option key={s} value={s} className="bg-white text-gray-900 font-bold">{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                                            <Clock size={12} />
                                            <span>{lead.lastActivity}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setActiveNoteLead(lead)
                                                    setNoteModalOpen(true)
                                                }}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm bg-white shrink-0"
                                                title="Add Note to Lead"
                                            >
                                                <FileText size={14} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedLead(lead)}
                                                className="w-8 h-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-110"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Note Modal */}
            <AnimatePresence>
                {noteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setNoteModalOpen(false)
                                setActiveNoteLead(null)
                                setNoteText('')
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl p-8 space-y-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tighter">Add Operations Note</h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        {activeNoteLead ? `Context: ${activeNoteLead.leadName}` : 'General Team Protocol Note'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setNoteModalOpen(false)
                                        setActiveNoteLead(null)
                                        setNoteText('')
                                    }}
                                    className="p-2 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Note Content</label>
                                    <textarea
                                        rows={4}
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="ENTER NOTE DIRECTIVES HERE..."
                                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveNote}
                                disabled={!noteText.trim() || addTeamNote.isPending}
                                className="w-full bg-[#111827] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                            >
                                {addTeamNote.isPending ? (
                                    <RefreshCcw className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <CheckCircle size={16} /> Save Protocol Note
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lead Detail Drawer (Placeholder) */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 z-[90] flex items-stretch justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLead(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-sm relative z-10 shadow-2xl border-l border-gray-100 flex flex-col h-full items-center justify-center p-8 text-center"
                        >
                            <Users size={48} className="text-gray-200 mb-4" />
                            <h3 className="text-lg font-black text-[#111827] uppercase tracking-tighter">{selectedLead.leadName}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{selectedLead.country} • {selectedLead.source}</p>
                            <p className="text-xs text-gray-500 mt-6 max-w-[250px]">Full lead intelligence profile and lifecycle history will be displayed in this panel.</p>

                            <button
                                onClick={() => setSelectedLead(null)}
                                className="mt-8 px-6 py-3 bg-gray-50 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Close Profile
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AssignedLeads
