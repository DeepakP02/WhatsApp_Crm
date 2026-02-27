import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Search,
    Filter,
    Clock,
    User,
    RefreshCcw,
    Plus,
    X,
    MessageSquare,
    CheckCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTeamLeaderActions } from '../../hooks/useTeamLeaderActions'

const ActivityLogs = () => {
    const { useActivityLogs, addTeamNote, refreshData } = useTeamLeaderActions()
    const { data: logs, isLoading } = useActivityLogs()
    const refreshLogs = refreshData('activityLogs')

    const [searchQuery, setSearchQuery] = useState('')
    const [noteModalOpen, setNoteModalOpen] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [noteLead, setNoteLead] = useState('')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const activityLogs = logs?.data || []
    const filteredLogs = activityLogs.filter(log =>
        (log.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.module || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details?.note || log.details?.action || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSaveNote = () => {
        if (!noteText.trim()) return
        addTeamNote.mutate({
            lead: noteLead || 'General Team Note',
            note: noteText
        })
        setNoteModalOpen(false)
        setNoteText('')
        setNoteLead('')
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Activity <span className="text-indigo-600">Logs</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Comprehensive team action history and notes</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm hidden sm:flex">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Sort: Newest First</span>
                    </div>
                    <button
                        onClick={() => refreshLogs.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} className={refreshLogs.isPending ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setNoteModalOpen(true)}
                        className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-100/20"
                    >
                        <Plus size={14} />
                        Add Log Entry
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
                            placeholder="SEARCH USERS, ACTIONS, LEADS, OR CONTENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Timestamp</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">User Identity</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Event Action</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Target Lead</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] w-1/3">Context / Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredLogs.map((log, i) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                                            <Clock size={12} className="text-gray-400" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                                                {(log.user?.name || 'U').charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-black text-[#111827] uppercase">{log.user?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "w-fit px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                            "bg-indigo-50 text-indigo-600 border-indigo-100"
                                        )}>
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight">
                                            {log.details?.action || log.action || 'INTERACTION'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 max-w-md">
                                        <div className="flex gap-2 items-start text-gray-600">
                                            <MessageSquare size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                            <p className="text-[11px] leading-relaxed">
                                                {typeof log.details === 'string' ? log.details : (log.details?.note || log.action)}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Add Entry Modal */}
            <AnimatePresence>
                {noteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setNoteModalOpen(false)
                                setNoteText('')
                                setNoteLead('')
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
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tighter">Add Activity Log</h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        Create a formal record in the team history
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setNoteModalOpen(false)
                                        setNoteText('')
                                        setNoteLead('')
                                    }}
                                    className="p-2 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Context (Optional)</label>
                                    <input
                                        type="text"
                                        value={noteLead}
                                        onChange={(e) => setNoteLead(e.target.value)}
                                        placeholder="E.G., GENERAL, POLICY, OR SPECIFIC LEAD NAME"
                                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-3 rounded-xl text-xs font-bold text-gray-700 uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Log Details</label>
                                    <textarea
                                        rows={4}
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="ENTER RECORD DETAILS HERE..."
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
                                        <CheckCircle size={16} /> Commit to Ledger
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ActivityLogs
