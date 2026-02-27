import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    AlertTriangle,
    CheckCircle2,
    Filter,
    Search,
    ChevronRight,
    Activity,
    ShieldCheck,
    RefreshCcw,
    MousePointer2
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const SlaMetrics = () => {
    const { useSlaMetrics, refreshData } = useManagerActions()
    const { data: sla, isLoading } = useSlaMetrics()
    const refreshSla = refreshData('sla')
    const [searchTeam, setSearchTeam] = useState('')
    const [selectedTeam, setSelectedTeam] = useState(null)

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const slaData = sla?.data || []
    const filteredSla = slaData.filter(t =>
        t.team.toLowerCase().includes(searchTeam.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">SLA <span className="text-indigo-600">Metrics</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Team-level response integrity and compliance orchestration</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Team / Time Range</span>
                        <div className="h-4 w-[1px] bg-gray-100" />
                        <span className="text-[9px] font-bold text-indigo-600 uppercase">Interactive SLA Suite</span>
                    </div>
                    <button
                        onClick={() => refreshSla.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            {/* SLA Table */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH TEAM CLUSTER..."
                            value={searchTeam}
                            onChange={(e) => setSearchTeam(e.target.value)}
                            className="bg-[#F3F4F6] border-none rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/10 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Operational Team</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Avg 1st Response</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Resolution Time</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">SLA Breaches</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Compliance Rate</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredSla.map((team, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                                                {team.team.charAt(0)}
                                            </div>
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{team.team}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span className="text-[11px] font-black text-indigo-600 italic tracking-tight">{team.avgFirstResponse}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[11px] font-black text-gray-600 italic tracking-tight">{team.avgResolution}</span>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-0.5 rounded-md border",
                                                team.breaches > 10 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-gray-50 text-gray-500 border-gray-100"
                                            )}>
                                                {team.breaches} Breaches
                                            </span>
                                            {team.breaches > 10 && <AlertTriangle size={14} className="text-rose-500 animate-pulse" />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: team.compliance }}
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        parseFloat(team.compliance) > 95 ? "bg-emerald-500" : "bg-amber-500"
                                                    )}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-600">{team.compliance}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#111827] hover:bg-[#111827] hover:text-white transition-all shadow-sm active:scale-90 flex items-center gap-2 ml-auto group-hover:scale-105">
                                            Logs <ChevronRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Insight Card */}
                <div className="bg-[#111827] rounded-[2.5rem] p-10 text-white flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                    <ShieldCheck className="absolute -left-10 -top-10 text-white/5" size={200} />
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global SLA Health: Stable</span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter max-w-xl">
                            "Compliance has increased by <span className="text-indigo-400">2.8%</span> since the implementation of AI-driven lead routing."
                        </h3>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SlaMetrics
