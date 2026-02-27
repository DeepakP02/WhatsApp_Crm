import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Target,
    Search,
    Filter,
    Clock,
    User,
    ChevronRight,
    RefreshCcw,
    X,
    TrendingUp,
    MessageSquare,
    Users
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTeamLeaderActions } from '../../hooks/useTeamLeaderActions'

const CounselorPerformance = () => {
    const { usePerformance, refreshData } = useTeamLeaderActions()
    const { data: performance, isLoading } = usePerformance()
    const refreshPerf = refreshData('performance')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCounselor, setSelectedCounselor] = useState(null)

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const leaderboard = performance?.data || []
    const filteredLeaderboard = leaderboard.filter(c =>
        c.counselor.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Counselor <span className="text-indigo-600">Performance</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Team leaderboard and operational drill-down</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm hidden sm:flex">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Global Date Range: Last 7 Days</span>
                    </div>
                    <button
                        onClick={() => refreshPerf.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} className={refreshPerf.isPending ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH COUNSELOR..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor Name</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Total Leads</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Replies Sent</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Conversions</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Avg Response Time</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Active Conv.</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Drill Down</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredLeaderboard.map((perf, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-500">
                                                    {perf.counselor.charAt(0)}
                                                </div>
                                                {i === 0 && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                                                        1
                                                    </div>
                                                )}
                                                {i === 1 && (
                                                    <div className="absolute -top-2 -right-2 bg-gray-300 text-gray-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                                                        2
                                                    </div>
                                                )}
                                                {i === 2 && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-700 text-amber-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                                                        3
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{perf.counselor}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-black text-gray-700">{perf.totalLeads}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-indigo-600">
                                            <MessageSquare size={14} />
                                            <span className="text-[11px] font-black">{perf.replies}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <TrendingUp size={14} />
                                            <span className="text-[11px] font-black">{perf.conversions}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-gray-400" />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase",
                                                parseInt(perf.avgResponse) > 10 ? "text-rose-500" : "text-gray-600"
                                            )}>{perf.avgResponse}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-black text-gray-700">{perf.activeConv}</span>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedCounselor(perf)}
                                            className="w-8 h-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-110"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Counselor Detail Drawer */}
            <AnimatePresence>
                {selectedCounselor && (
                    <div className="fixed inset-0 z-[100] flex items-stretch justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCounselor(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-md relative z-10 shadow-2xl border-l border-gray-100 flex flex-col h-full"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200">
                                        {selectedCounselor.counselor.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-[#111827] uppercase tracking-tighter">{selectedCounselor.counselor}</h3>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Target size={10} /> Tier 1 Counselor
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCounselor(null)}
                                    className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-rose-500 rounded-xl transition-all shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* SLA Performance Widget */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-widest">SLA Compliance Overview</h4>
                                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 grid grid-cols-2 gap-4 shadow-sm">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Avg Response</p>
                                            <p className={cn(
                                                "text-lg font-black",
                                                parseInt(selectedCounselor.avgResponse) > 10 ? "text-rose-600" : "text-emerald-600"
                                            )}>{selectedCounselor.avgResponse}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Resolution Rate</p>
                                            <p className="text-lg font-black text-[#111827]">94.2%</p>
                                        </div>
                                        <div className="col-span-2 pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-gray-500">Weekly Target Match</span>
                                                <span className="text-indigo-600">85%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 w-[85%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Assigned Leads List */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Recent Assigned Leads</h4>
                                    <div className="space-y-2">
                                        {[1, 2, 3].map((_, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <User size={14} className="text-gray-400" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-[#111827] uppercase tracking-tight">Lead #{1045 + idx}</p>
                                                        <p className="text-[8px] font-bold text-gray-500 uppercase">Assigned 2h ago</p>
                                                    </div>
                                                </div>
                                                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                                    Active
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 text-[9px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
                                        View All {selectedCounselor.totalLeads} Leads <ChevronRight size={10} />
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

export default CounselorPerformance
