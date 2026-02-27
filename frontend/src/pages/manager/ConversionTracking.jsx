import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Target,
    ArrowUpRight,
    Filter,
    Search,
    ChevronDown,
    Layers,
    UserCheck,
    CheckCircle,
    TrendingUp,
    RefreshCcw
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useManagerActions } from '../../hooks/useManagerActions'

const ConversionTracking = () => {
    const { useConversionTracking, refreshData } = useManagerActions()
    const { data: conversion, isLoading } = useConversionTracking()
    const refreshConversion = refreshData('conversion')
    const [searchTeam, setSearchTeam] = useState('')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const conversionData = conversion?.data || []
    const filteredConversion = conversionData.filter(t =>
        t.team.toLowerCase().includes(searchTeam.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Conversion <span className="text-indigo-600">Tracking</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Team-level conversion liquidity and outcome attribution</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Global Constraints</span>
                        <div className="h-4 w-[1px] bg-gray-100" />
                        <span className="text-[9px] font-bold text-indigo-600 uppercase">Interactive Filter Suite</span>
                    </div>
                    <button
                        onClick={() => refreshConversion.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Conversion Table */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="FILTER BY TEAM CLUSTER..."
                            value={searchTeam}
                            onChange={(e) => setSearchTeam(e.target.value)}
                            className="bg-[#F3F4F6] border-none rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/10 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <TrendingUp size={14} className="text-indigo-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sort By:</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#111827]">Conversion Rate %</span>
                        <ChevronDown size={12} className="text-gray-400" />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Operational Team</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Leads Assigned</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Qualified</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Converted</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Enrolled</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredConversion.map((team, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <Layers size={14} />
                                            </div>
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{team.team}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-black text-gray-600">{team.assigned.toLocaleString()}</span>
                                            <div className="p-1 bg-gray-50 rounded text-gray-400">
                                                <UserCheck size={10} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[11px] font-black text-emerald-600">{team.qualified.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[11px] font-black text-blue-600">{team.converted.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[11px] font-black text-indigo-600">{team.enrolled.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="bg-indigo-500 h-full w-3/4" />
                                            </div>
                                            <span className="text-[11px] font-black text-[#111827] tracking-tight">{team.conversion}</span>
                                            <ArrowUpRight size={14} className="text-emerald-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Top Converting Team', val: 'Admissions South', icon: Target, color: 'text-indigo-600' },
                        { label: 'Highest Enrollment', val: 'Admissions South', icon: CheckCircle, color: 'text-emerald-600' },
                        { label: 'Month Over Month', val: '+12.4% Increase', icon: TrendingUp, color: 'text-blue-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-[#E5E7EB] shadow-sm flex items-center gap-4 group hover:border-indigo-100 transition-all">
                            <div className={cn("p-3 rounded-2xl bg-gray-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors", stat.color)}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xs font-black text-[#111827] uppercase tracking-tight mt-0.5">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default ConversionTracking
