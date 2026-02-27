import React from 'react'
import { motion } from 'framer-motion'
import {
    Target,
    Download,
    Clock,
    Filter,
    ChevronRight,
    ArrowRight,
    Users,
    RefreshCcw,
    CheckCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const LeadFunnel = () => {
    const { useFunnel, exportCsv, refreshData } = useManagerActions()
    const { data: funnel, isLoading } = useFunnel()
    const exportFunnel = exportCsv('funnel')
    const refreshFunnel = refreshData('funnel')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const funnelData = funnel?.data || []

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Lead <span className="text-indigo-600">Funnel</span> Reports</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">High-precision conversion monitoring and stage lifecycle analytics</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Date / Country Filters</span>
                        <div className="h-4 w-[1px] bg-gray-100" />
                        <span className="text-[9px] font-bold text-indigo-600 uppercase">Interactive Filter Suite</span>
                    </div>
                    <button
                        onClick={() => exportFunnel.mutate()}
                        disabled={exportFunnel.isPending}
                        className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-100/20"
                    >
                        {exportFunnel.isPending ? <RefreshCcw className="animate-spin" size={14} /> : <Download size={14} />}
                        Export CSV
                    </button>
                    <button
                        onClick={() => refreshFunnel.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Funnel Layout (Simplified Table-Only per requirements) */}
            <section className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Pipeline Stage</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Leads Count</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Stage Efficiency</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Assigned Cluster</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Avg Stage Velocity</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Drill-Down</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {funnelData.map((stage, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-2xl flex items-center justify-center shadow-sm border",
                                                stage.stage === 'New' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                    stage.stage === 'Qualified' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        stage.stage === 'Converted' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            "bg-rose-50 text-rose-600 border-rose-100"
                                            )}>
                                                {stage.stage === 'New' ? <Users size={18} /> :
                                                    stage.stage === 'Qualified' ? <Target size={18} /> :
                                                        stage.stage === 'Converted' ? <ArrowRight size={18} /> :
                                                            <CheckCircle size={18} />}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{stage.stage}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="bg-indigo-500 h-full w-2/3" />
                                                    </div>
                                                    <span className="text-[8px] font-bold text-gray-400">STAGE {i + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-sm font-black text-[#111827] tracking-tight">{stage.count.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-indigo-600 italic">{stage.prevStagePct}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">From Previous</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {stage.team}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span className="text-[11px] font-black text-gray-600 uppercase italic">{stage.avgTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <button className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#111827] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90">
                                            Protocol View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h4 className="text-sm font-black text-[#111827] uppercase tracking-tight">Autonomous Funnel Optimization</h4>
                        <p className="text-[10px] font-bold text-gray-500 max-w-lg uppercase leading-relaxed">System has detected a 4.2% drop-off in the CONVERTED stage. Recommend increasing follow-up frequency for the Indian Admissions Team.</p>
                    </div>
                    <button className="px-6 py-3 bg-[#111827] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2">
                        Apply System Optimizations <ArrowRight size={14} />
                    </button>
                </div>
            </section>
        </div>
    )
}

export default LeadFunnel
