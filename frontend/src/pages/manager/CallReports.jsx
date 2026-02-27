import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Phone,
    Download,
    Search,
    Filter,
    ChevronRight,
    Clock,
    User,
    Globe,
    Calendar,
    X,
    MessageSquare,
    RefreshCcw,
    CheckCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const CallReports = () => {
    const managerActions = useManagerActions()
    const { data: calls, isLoading } = managerActions.useCallReports()
    const exportCalls = managerActions.exportCsv('calls')
    const refreshCalls = managerActions.refreshData('calls')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCall, setSelectedCall] = useState(null)

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const callLogs = calls?.data || []
    const filteredCalls = callLogs.filter(c =>
        c.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.counselor.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Call <span className="text-indigo-600">Reports</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detailed telephony logs and outcome attribution hierarchy</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Counselor / Territory</span>
                    </div>
                    <button
                        onClick={() => exportCalls.mutate()}
                        disabled={exportCalls.isPending}
                        className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-100/20"
                    >
                        {exportCalls.isPending ? <RefreshCcw className="animate-spin" size={14} /> : <Download size={14} />}
                        Export CSV
                    </button>
                    <button
                        onClick={() => refreshCalls.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Main Table Area */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH BY LEAD OR AGENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#F3F4F6] border-none rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/10 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Name</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Duration</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Outcome</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Date</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredCalls.map((call, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelectedCall(call)}
                                    className="hover:bg-gray-50/50 transition-all group cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                                                {call.counselor.charAt(0)}
                                            </div>
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{call.counselor}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black text-gray-600 uppercase tracking-tight">{call.lead}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Globe size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase">{call.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-600 italic">{call.duration}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            call.outcome === 'Converted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                call.outcome === 'Interested' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {call.outcome}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{call.date}</span>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                        <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-110">
                                            <ChevronRight size={14} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal Detail (Simulated) */}
            <AnimatePresence>
                {selectedCall && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCall(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                            <Phone size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-[#111827] uppercase tracking-tighter">Call Protocol Detail</h3>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Session ID: CRM-CALL-{selectedCall.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCall(null)}
                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Counselor Participant</p>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <User size={16} className="text-indigo-600" />
                                            <span className="text-xs font-black text-[#111827] uppercase">{selectedCall.counselor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Lead Identity</p>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <MessageSquare size={16} className="text-indigo-600" />
                                            <span className="text-xs font-black text-[#111827] uppercase">{selectedCall.lead}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Operational Metadata</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Date', val: selectedCall.date, icon: Calendar },
                                            { label: 'Duration', val: selectedCall.duration, icon: Clock },
                                            { label: 'Outcome', val: selectedCall.outcome, icon: CheckCircle },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1">
                                                <item.icon size={14} className="text-indigo-600" />
                                                <p className="text-[7px] font-black text-gray-400 uppercase mt-1">{item.label}</p>
                                                <p className="text-[10px] font-black text-[#111827] uppercase tracking-tight">{item.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Session Summary Note</p>
                                    <div className="p-5 bg-indigo-50/50 border border-indigo-100/50 rounded-3xl">
                                        <p className="text-[11px] font-bold text-indigo-900 leading-relaxed italic">
                                            "Lead expressed significant interest in the Q1 Enrollment program. Discussion focused on payment plans and curriculum details. Counselor Rahul K. scheduled a follow-up session for 48 hours post-call."
                                        </p>
                                    </div>
                                </div>

                                <button className="w-full bg-[#111827] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl">
                                    Download Call Transcript
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CallReports
