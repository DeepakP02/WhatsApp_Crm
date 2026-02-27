import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Inbox,
    Search,
    Filter,
    Clock,
    User,
    Globe,
    AlertCircle,
    BellRing,
    ChevronRight,
    RefreshCcw,
    X,
    MessageSquare
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTeamLeaderActions } from '../../hooks/useTeamLeaderActions'

const TeamInbox = () => {
    const { useInbox, sendReminder, refreshData } = useTeamLeaderActions()
    const { data: inbox, isLoading } = useInbox()
    const refreshInbox = refreshData('inbox')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedConv, setSelectedConv] = useState(null)

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const conversations = inbox?.data || []
    const filteredConvs = conversations.filter(c =>
        c.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.counselor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Team <span className="text-indigo-600">Inbox</span> Monitor</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Oversight of pending and active team conversations</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm hidden sm:flex">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Counselor / Status Filter</span>
                    </div>
                    <button
                        onClick={() => refreshInbox.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} className={refreshInbox.isPending ? "animate-spin" : ""} />
                        <span className="text-[10px] font-black uppercase tracking-widest sm:hidden">Refresh</span>
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
                            placeholder="SEARCH BY LEAD, COUNSELOR OR COUNTRY..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 shadow-sm whitespace-nowrap">
                        <AlertCircle size={14} />
                        {conversations.filter(c => c.status === 'Pending').length} Pending Replies
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Name</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Country</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Status & Time</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredConvs.map((conv, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                                                {conv.leadName.charAt(0)}
                                            </div>
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{conv.leadName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Globe size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase">{conv.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-[#111827] uppercase">{conv.counselor}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={cn(
                                                "w-fit px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                conv.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            )}>
                                                {conv.status}
                                            </span>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                                                <Clock size={10} />
                                                <span>{conv.lastMessage}</span>
                                                {conv.slaTimer !== '-' && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
                                                        <span className="text-rose-500">SLA: {conv.slaTimer}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {conv.status === 'Pending' && (
                                                <button
                                                    onClick={() => sendReminder.mutate(conv.counselor)}
                                                    className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors border border-amber-100 shadow-sm hidden sm:flex items-center gap-2 group-hover:opacity-100 opacity-60"
                                                    title="Send Reminder to Counselor"
                                                >
                                                    <BellRing size={14} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Ping</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedConv(conv)}
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

            {/* Conversation Drawer / Modal Detail */}
            <AnimatePresence>
                {selectedConv && (
                    <div className="fixed inset-0 z-[100] flex items-stretch justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedConv(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-md relative z-10 shadow-2xl border-l border-gray-100 flex flex-col h-full"
                        >
                            <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <MessageSquare size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-[#111827] uppercase tracking-tighter">Live Session Protocol</h3>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                <User size={10} /> {selectedConv.counselor} Managing
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedConv(null)}
                                        className="p-2 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-lg transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Lead Identity</p>
                                        <p className="text-[11px] font-black text-[#111827] uppercase mt-0.5">{selectedConv.leadName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                                        <span className={cn(
                                            "inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                            selectedConv.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        )}>
                                            {selectedConv.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Simulated Chat History (Viewing Mode) */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB]/50">
                                <div className="flex justify-center">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest">Session Started Today</span>
                                </div>

                                {/* Incoming Message from Lead */}
                                <div className="flex flex-col items-start max-w-[85%] gap-1">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase ml-2">{selectedConv.leadName} • {selectedConv.lastMessage}</span>
                                    <div className="bg-white border border-gray-100 p-4 rounded-[1.5rem] rounded-tl-sm shadow-sm text-sm text-gray-600 relative overflow-hidden">
                                        Hello, I would like to know the fee structure for the new program intake. I saw the ad on Facebook.
                                    </div>
                                </div>

                                {/* Placeholder for Counselor Action */}
                                {selectedConv.status === 'Pending' ? (
                                    <div className="flex flex-col items-end max-w-[85%] ml-auto gap-1">
                                        <span className="text-[8px] font-bold text-amber-500 uppercase mr-2 flex items-center gap-1 animate-pulse">
                                            <Clock size={10} /> Counselor Typing / Pending...
                                        </span>
                                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-[1.5rem] rounded-tr-sm shadow-sm text-sm text-amber-800/50 italic flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce delay-75" />
                                            <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end max-w-[85%] ml-auto gap-1">
                                        <span className="text-[8px] font-bold text-gray-400 uppercase mr-2">{selectedConv.counselor} • Just Now</span>
                                        <div className="bg-indigo-600 text-white p-4 rounded-[1.5rem] rounded-tr-sm shadow-sm text-sm">
                                            Hi {selectedConv.leadName}, thank you for reaching out! I'm sending you the PDF with the complete fee structure right away.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions / Footer */}
                            <div className="p-6 border-t border-gray-100 bg-white">
                                {selectedConv.status === 'Pending' ? (
                                    <button
                                        onClick={() => {
                                            sendReminder.mutate(selectedConv.counselor);
                                            setSelectedConv(null);
                                        }}
                                        className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                    >
                                        <BellRing size={16} /> Force Priority Alert to Counselor
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedConv(null)}
                                        className="w-full bg-[#111827] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all"
                                    >
                                        Close Protocol
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TeamInbox
