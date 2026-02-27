import React, { useState } from 'react'
import { Phone, Facebook, MousePointer2, Users, ArrowUpRight, TrendingUp, RefreshCw, Shield, Clock, Power } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../api/admin.api.js'
import { useAiActions } from '../hooks/useCrmMutations'

const AdminKPICard = ({ title, value, icon: Icon, subValue, color, isRefetching }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB] relative overflow-hidden group transition-all hover:shadow-md"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2 rounded-lg", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
                {isRefetching && <RefreshCw size={12} className="text-indigo-500 animate-spin" />}
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    +12%
                </span>
            </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-[#111827] tracking-tight">{value}</h3>
            {subValue && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">/ {subValue}</span>}
        </div>
        <div className="absolute -right-4 -bottom-4 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Icon size={100} />
        </div>
    </motion.div>
)

const AdminDashboard = () => {
    const { updateConfig } = useAiActions()

    const { data: channelStats, isLoading: isLoadingStats, refetch: refetchStats, isRefetching } = useQuery({
        queryKey: ['adminChannelStats'],
        queryFn: adminApi.fetchChannelStats
    })

    const { data: routingRules = [], isLoading: isLoadingRouting } = useQuery({
        queryKey: ['adminRoutingRules'],
        queryFn: adminApi.fetchRoutingRules
    })

    const { data: aiConfig, isLoading: isLoadingAi } = useQuery({
        queryKey: ['adminAiConfig'],
        queryFn: adminApi.fetchAiConfig
    })

    const isLoading = isLoadingStats || isLoadingRouting || isLoadingAi;
    const refetch = () => { refetchStats(); }

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <RefreshCw className="animate-spin text-indigo-500" size={32} />
            </div>
        )
    }

    const kpis = [
        { title: 'WhatsApp Numbers', value: channelStats?.whatsapp || 0, subValue: 'Active Nodes', icon: Phone, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Facebook Pages', value: channelStats?.facebook || 0, subValue: 'Connected', icon: Facebook, color: 'bg-blue-50 text-blue-600' },
        { title: 'Website Leads Today', value: channelStats?.website || 0, subValue: '24h Window', icon: MousePointer2, color: 'bg-indigo-50 text-indigo-600' },
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Admin Console</h1>
                    <p className="text-sm font-medium text-gray-500">Global system configuration and channel management architecture.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm active:scale-90"
                    >
                        <RefreshCw size={18} className={cn(isRefetching && "animate-spin text-indigo-500")} />
                    </button>
                    <button className="flex items-center gap-3 bg-[#111827] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95">
                        <ArrowUpRight className="h-4 w-4" />
                        <span>Quick Connect</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <AdminKPICard key={index} {...kpi} isRefetching={isRefetching} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Routing Preview Table */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h3 className="font-black text-[#111827] text-xs uppercase tracking-[0.2em]">Routing Strategy Preview</h3>
                            <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">Active assignment logic distribution</p>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-indigo-600 uppercase tracking-widest shadow-sm">Live System</span>
                    </div>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-[#F9FAFB]/50">
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Team / Lead</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Mechanism</th>
                                    <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/50">
                                {routingRules.slice(0, 5).map((rule, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                                <span className="font-black text-xs text-[#111827] uppercase tracking-tight">{rule.country}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{rule.team?.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {rule.team?.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">
                                                {rule.strategy}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-1.5 w-1.5 rounded-full", "bg-emerald-500")} />
                                                <span className={cn("text-[9px] font-black uppercase tracking-widest", "text-emerald-600")}>
                                                    Active
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Bot Status Card */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111827] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100/50"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <Shield size={24} className="text-indigo-400" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full animate-pulse", aiConfig?.autoAssignment ? "bg-emerald-400" : "bg-rose-400")} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{aiConfig?.autoAssignment ? 'Processing' : 'Offline'}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Neural Qualification</h3>
                            <p className="text-xs font-medium text-gray-400 leading-relaxed mb-8 uppercase tracking-widest">Autonomous lead vetting and scoring engine.</p>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-600 rounded-lg">
                                        <Power size={14} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">AI Master Switch</span>
                                </div>
                                <button
                                    onClick={() => updateConfig.mutate({ autoAssignment: !aiConfig?.autoAssignment })}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
                                        aiConfig?.autoAssignment ? "bg-indigo-500" : "bg-gray-700"
                                    )}
                                >
                                    <span className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
                                        aiConfig?.autoAssignment ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                <Clock size={12} />
                                <span>Model: {aiConfig?.model || 'gpt-4o'}</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <RefreshCw size={180} className="animate-[spin_10s_linear_infinite]" />
                        </div>
                    </motion.div>

                    <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] p-8 shadow-sm">
                        <h4 className="font-black text-[#111827] text-[10px] uppercase tracking-[0.2em] mb-4">Quick Governance</h4>
                        <div className="space-y-3">
                            {['Force Cache Flush', 'Download Log Bundle', 'System Health Check'].map((action) => (
                                <button key={action} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-white transition-all group">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{action}</span>
                                    <ArrowUpRight size={14} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
