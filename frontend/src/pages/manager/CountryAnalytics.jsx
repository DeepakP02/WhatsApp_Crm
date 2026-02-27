import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Globe,
    ChevronRight,
    Search,
    Filter,
    Activity,
    Users,
    Target,
    CheckCircle,
    XCircle,
    RefreshCcw,
    Layout
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const MetricMiniCard = ({ label, value, color }) => (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm space-y-1">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
        <p className={cn("text-lg font-black leading-none", color)}>{value}</p>
    </div>
)

const CountryAnalytics = () => {
    const { useCountryAnalytics, refreshData } = useManagerActions()
    const { data: analytics, isLoading } = useCountryAnalytics()
    const refreshCountry = refreshData('country')
    const [searchCountry, setSearchCountry] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(null)

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const analyticsData = analytics?.data || []
    const filteredAnalytics = analyticsData.filter(c =>
        c.country.toLowerCase().includes(searchCountry.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Country <span className="text-indigo-600">Analytics</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Global territory distribution and regional conversion benchmarks</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Territory Cluster</span>
                        <div className="h-4 w-[1px] bg-gray-100" />
                        <span className="text-[9px] font-bold text-indigo-600 uppercase">Interactive Filters</span>
                    </div>
                    <button
                        onClick={() => refreshCountry.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Table */}
                <section className={cn(
                    "space-y-6 transition-all duration-500",
                    selectedCountry ? "lg:col-span-12 xl:col-span-7" : "lg:col-span-12"
                )}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative group flex-1 max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="IDENTIFY COUNTRY..."
                                value={searchCountry}
                                onChange={(e) => setSearchCountry(e.target.value)}
                                className="bg-[#F3F4F6] border-none rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/10 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#F9FAFB]/50">
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Country Identity</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Total Leads</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Qualified</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Converted</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lost</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Conversion %</th>
                                    <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/50">
                                {filteredAnalytics.map((c, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => setSelectedCountry(c)}
                                        className={cn(
                                            "transition-all cursor-pointer group",
                                            selectedCountry?.country === c.country ? "bg-indigo-50/50" : "hover:bg-gray-50/50"
                                        )}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <Globe size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{c.country}</span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Top Team: {c.topTeam}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-gray-600">{c.total?.toLocaleString() ?? 0}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-emerald-600">{c.qualified?.toLocaleString() ?? 0}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-blue-600">{c.converted?.toLocaleString() ?? 0}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-rose-500">{c.lost?.toLocaleString() ?? 0}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-500 h-full" style={{ width: c.conversion }} />
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-700 italic">{c.conversion}</span>
                                            </div>
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

                {/* Country Detail Section (Appears when row clicked) */}
                <AnimatePresence>
                    {selectedCountry && (
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="lg:col-span-12 xl:col-span-5 space-y-6"
                        >
                            <div className="bg-[#111827] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                {/* Decor */}
                                <Globe className="absolute -right-8 -top-8 text-white/5" size={240} strokeWidth={1} />

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedCountry.country}</h2>
                                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Detailed Territory Protocol Breakdown</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCountry(null)}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricMiniCard label="Territory Conversion" value={selectedCountry.conversion} color="text-indigo-600" />
                                        <MetricMiniCard label="Qualified Rank" value="#04 Global" color="text-emerald-600" />
                                    </div>

                                    <div className="space-y-6 pb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Performance Snapshot</span>
                                            <div className="h-[1px] flex-1 bg-white/10 mx-4" />
                                            <Activity size={14} className="text-indigo-400" />
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'Avg Counselor SLA', val: '2.4 mins', icon: Target },
                                                { label: 'Peak Traffic Time', val: '14:00 - 18:00', icon: Layout },
                                                { label: 'Top Team Density', val: '12 Agents', icon: Users },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={16} className="text-white/40 group-hover:text-indigo-400 transition-colors" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{item.label}</span>
                                                    </div>
                                                    <span className="text-xs font-black italic">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl">
                                        Extract Territory Dataset
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default CountryAnalytics
