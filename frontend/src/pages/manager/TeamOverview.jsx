import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users2,
    ArrowLeft,
    ChevronRight,
    Search,
    Filter,
    Clock,
    Target,
    CheckCircle,
    UserCircle2,
    Activity,
    RefreshCcw,
    Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const TeamOverview = () => {
    const { useTeamOverview, refreshData } = useManagerActions()
    const { data: teams, isLoading } = useTeamOverview()
    const refreshTeams = refreshData('team')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTeam, setSelectedTeam] = useState(null)

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const teamData = teams?.data || []
    const filteredTeams = teamData.filter(t =>
        t.team.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Specific counselor breakdown (mocked for the selected team)
    const counselorBreakdown = [
        { name: 'Rahul K.', leads: 45, qualified: 18, converted: 5, responseTime: '1.2m' },
        { name: 'Sarah J.', leads: 32, qualified: 12, converted: 3, responseTime: '2.5m' },
        { name: 'John D.', leads: 28, qualified: 8, converted: 2, responseTime: '3.1m' },
        { name: 'Priya M.', leads: 52, qualified: 22, converted: 8, responseTime: '0.8m' },
    ]

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <AnimatePresence mode="wait">
                {!selectedTeam ? (
                    <motion.div
                        key="header-main"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Team <span className="text-indigo-600">Overview</span></h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational hierarchy and collective performance monitoring</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                                <Filter size={14} className="text-gray-400" />
                                <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Active Clusters</span>
                            </div>
                            <button
                                onClick={() => refreshTeams.mutate()}
                                className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm"
                            >
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="header-detail"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 shadow-sm transition-all active:scale-95"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">{selectedTeam.team} <span className="text-indigo-600">Breakdown</span></h1>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Counselor-level performance attribution</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                            <Zap size={14} className="fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest">System Integrated</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {!selectedTeam ? (
                    <motion.section
                        key="team-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative group flex-1 max-w-sm">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="IDENTIFY TEAM CLUSTER..."
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
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Team Name</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Active Leads</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Qualified</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Converted</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Avg Response</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Cluster Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]/50">
                                    {filteredTeams.map((team, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => setSelectedTeam(team)}
                                            className="hover:bg-gray-50/50 transition-all group cursor-pointer"
                                        >
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        <Users2 size={16} />
                                                    </div>
                                                    <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{team.team}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-[11px] font-black text-gray-600">{team.activeLeads}</span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-[11px] font-black text-emerald-600">{team.qualified}</span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-[11px] font-black text-blue-600">{team.converted}</span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-black text-indigo-700 italic">{team.avgResponse}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase">{team.counselors} AGENTS</span>
                                                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-110">
                                                        <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        key="counselor-list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Summary Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Cluster Leads', val: selectedTeam.activeLeads, color: 'text-indigo-600' },
                                { label: 'Cluster Conv.', val: selectedTeam.converted, color: 'text-blue-600' },
                                { label: 'Response Integrity', val: selectedTeam.avgResponse, color: 'text-emerald-600' },
                                { label: 'Active Agents', val: selectedTeam.counselors, color: 'text-amber-600' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white border border-[#E5E7EB] p-4 rounded-3xl shadow-sm">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                    <p className={cn("text-xl font-black mt-1", s.color)}>{s.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Counselor Table */}
                        <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-[#F9FAFB]/50">
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor Identity</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Assigned Leads</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Qualified</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Converted</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Response Time</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]/50">
                                    {counselorBreakdown.map((c, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                                        <UserCircle2 size={24} strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{c.name}</span>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Activity size={10} className="text-emerald-500" />
                                                            <span className="text-[8px] font-black text-emerald-600 uppercase">Active Now</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-[11px] font-black text-gray-600">{c.leads}</span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-[11px] font-black text-emerald-600">{c.qualified}</span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-[11px] font-black text-blue-600">{c.converted}</span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="bg-indigo-500 h-full" style={{ width: i === 0 ? '90%' : '60%' }} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-indigo-700 italic">{c.responseTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#111827] hover:bg-white hover:border-[#111827] transition-all active:scale-95">
                                                    View Lead Matrix
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TeamOverview
