import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Target,
    CheckCircle,
    GraduationCap,
    RefreshCcw,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Globe,
    ChevronRight,
    Filter
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'
import useStore from '../../store/useStore'

const KpiCard = ({ title, value, subText, icon: Icon, color, onRefresh }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4 group"
    >
        <div className="flex items-center justify-between">
            <div className={cn("p-2.5 rounded-xl", color)}>
                <Icon size={20} className="text-current" />
            </div>
            <button
                onClick={onRefresh}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 bg-gray-50 border border-gray-100/50 rounded-lg transition-all"
            >
                <RefreshCcw size={14} />
            </button>
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-black text-[#111827]">{value}</h3>
                <div className={cn(
                    "flex items-center gap-0.5 text-[10px] font-black pb-1.5",
                    subText.startsWith('+') ? "text-emerald-600" : "text-rose-600"
                )}>
                    {subText.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {subText.replace('+', '').replace('-', '')}
                </div>
            </div>
        </div>
    </motion.div>
)

const ManagerDashboard = () => {
    const { useDashboard, refreshData } = useManagerActions()
    const { data: dashboard, isLoading } = useDashboard()
    const refreshKpi = refreshData('dashboard')
    const [searchQuery, setSearchQuery] = useState('')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const { kpis, funnelSummary, countryPerformance } = dashboard?.data || {}

    const filteredCountries = countryPerformance?.filter(c =>
        c.country.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Performance <span className="text-indigo-600">Dashboard</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational intelligence for global lead orchestration</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Global Filters Active</span>
                        <div className="h-4 w-[1px] bg-gray-100" />
                        <span className="text-[9px] font-bold text-indigo-600 uppercase">Q1 2024</span>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis?.map((kpi, i) => (
                    <KpiCard
                        key={i}
                        {...kpi}
                        icon={
                            kpi.type === 'leads_today' ? Users :
                                kpi.type === 'qualified_today' ? Target :
                                    kpi.type === 'converted_today' ? GraduationCap :
                                        CheckCircle
                        }
                        color={
                            kpi.type === 'leads_today' ? 'bg-indigo-50 text-indigo-600' :
                                kpi.type === 'qualified_today' ? 'bg-emerald-50 text-emerald-600' :
                                    kpi.type === 'converted_today' ? 'bg-blue-50 text-blue-600' :
                                        'bg-rose-50 text-rose-600'
                        }
                        onRefresh={() => refreshKpi.mutate()}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Lead Funnel Summary */}
                <section className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest flex items-center gap-2">
                                <Target className="text-indigo-600" size={18} />
                                Funnel Summary
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Aggregate conversion highlights</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[400px]">
                            <thead>
                                <tr className="bg-[#F9FAFB]/50">
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Stage</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Count</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Conv. Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/50">
                                {funnelSummary?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-all cursor-pointer group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    item.stage === 'New' ? 'bg-indigo-400' :
                                                        item.stage === 'Qualified' ? 'bg-emerald-400' :
                                                            item.stage === 'Converted' ? 'bg-blue-400' : 'bg-rose-400'
                                                )} />
                                                <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{item.stage}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-gray-600">{item.total.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-black text-indigo-600">{item.conversion}</span>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Drop: {item.dropoff}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="w-full py-4 bg-gray-50/50 text-[9px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-all border-t border-gray-100">
                            Drill Down Into Funnel Logistics
                        </button>
                    </div>
                </section>

                {/* Country Performance Table */}
                <section className="lg:col-span-7 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest flex items-center gap-2">
                                <Globe className="text-indigo-600" size={18} />
                                Regional Performance
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Leads and conversion metrics by territory</p>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="IDENTIFY TERRITORY..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#F3F4F6] border-none rounded-xl py-2.5 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#F9FAFB]/50">
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Country</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Leads</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Converted</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Enrolled</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Response</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/50">
                                {filteredCountries?.map((c, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{c.country}</span>
                                            <div className="text-[8px] font-bold text-gray-400 uppercase mt-1">{c.teams} Active Teams</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-gray-600">{c.leads}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-indigo-600">{c.converted}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-emerald-600">{c.enrolled}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-500 h-full w-2/3" />
                                                </div>
                                                <span className="text-[9px] font-black text-gray-500">{c.responseTime}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="w-8 h-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-110">
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ManagerDashboard
