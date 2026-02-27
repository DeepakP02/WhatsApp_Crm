import React from 'react'
import { Filter, Search, ChevronDown, CheckCircle, TrendingUp, Inbox, Target, Zap, RefreshCw, BarChart3, Users2, Timer } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import mockApi from '../../lib/mockApi'
import { motion } from 'framer-motion'

const SummaryTable = ({ title, icon: Icon, color, headers, data, isLoading }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl shadow-sm", color)}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="font-black text-[#111827] text-sm uppercase tracking-tight">{title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Data Feed v1.0</p>
                </div>
            </div>
            {isLoading && <RefreshCw size={14} className="text-gray-300 animate-spin" />}
        </div>
        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                    <tr className="bg-[#F9FAFB]/50">
                        {headers.map((h, i) => (
                            <th key={i} className="px-8 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                {headers.map((_, j) => (
                                    <td key={j} className="px-8 py-6">
                                        <div className="h-4 bg-gray-100 rounded-lg w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                {Object.values(row).map((val, j) => (
                                    <td key={j} className={cn("px-8 py-6 transition-colors", j === 0 ? "font-black text-[#3B5BDB] group-hover:text-indigo-600" : "text-gray-600 font-bold")}>
                                        {j === 0 ? val : (
                                            <span className="tabular-nums">{val}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </motion.div>
)

const SystemAnalytics = () => {
    const { data: analytics, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['system-analytics'],
        queryFn: () => mockApi.analytics.getSummary().then(res => res.data)
    })

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Analytical Command</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Decentralized performance metrics and global resource summaries.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 active:scale-95 transition-all shadow-sm flex items-center gap-3 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">Refresh Signal</span>
                    </button>
                    <div className="bg-indigo-50 px-6 py-4 rounded-3xl flex items-center gap-4 border border-indigo-100 shadow-sm transition-all hover:shadow-indigo-100">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                            <TrendingUp size={16} className="text-indigo-600" />
                        </div>
                        <div>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter block">System Growth</span>
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">+18.4% Efficiency</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <SummaryTable
                    title="Leads By Country"
                    icon={Target}
                    color="bg-indigo-50 text-indigo-600"
                    headers={['Country Zone', 'Total Leads Generated', 'Qualified Pipelines']}
                    data={analytics?.leadsByCountry || []}
                    isLoading={isLoading}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <SummaryTable
                        title="Leads By Source"
                        icon={Inbox}
                        color="bg-emerald-50 text-emerald-600"
                        headers={['Ingress Channel', 'Total Leads', 'Successful Conversions']}
                        data={analytics?.leadsBySource || []}
                        isLoading={isLoading}
                    />
                    <SummaryTable
                        title="Active System Users"
                        icon={Users2}
                        color="bg-amber-50 text-amber-600"
                        headers={['Operational Tier', 'Allocated Seats', 'Online Today']}
                        data={analytics?.activeUsers || []}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <div className="p-8 bg-[#111827] rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gray-800 rounded-3xl">
                        <BarChart3 size={24} className="text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tight">Telemetry Synchronized</h4>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Live data streaming from all active operational zones</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <div className="text-white font-black text-lg tracking-tighter uppercase">520.1k</div>
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Total Hits</div>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-800" />
                    <div className="text-center">
                        <div className="text-emerald-400 font-black text-lg tracking-tighter uppercase">99.98%</div>
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemAnalytics
