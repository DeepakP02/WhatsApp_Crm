import React, { useState } from 'react'
import { Search, Loader, Filter, CheckCircle2, ChevronRight, Activity, ArrowRight, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useCounselorActions } from '../../hooks/useCrmMutations'
import counselorApi from '../../api/counselor.api.js'

const LeadStages = () => {
    const { updateStage } = useCounselorActions()
    const [searchTerm, setSearchTerm] = useState('')

    const { data: stagesResp, isLoading } = useQuery({
        queryKey: ['counselor-leads'], // Re-use counselor-leads key
        queryFn: () => counselorApi.fetchLeads()
    })

    const stagesData = (Array.isArray(stagesResp?.data) ? stagesResp.data : []).map(l => ({
        id: l.id,
        leadName: l.name,
        currentStage: l.stage.charAt(0) + l.stage.slice(1).toLowerCase(),
        lastUpdated: new Date(l.updatedAt).toLocaleDateString()
    }))

    const filteredStages = stagesData.filter(s =>
        s.leadName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStageColorList = (stage) => {
        switch (stage) {
            case 'Qualified': return 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:border-emerald-300'
            case 'Converted': return 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:border-indigo-300'
            case 'New': return 'text-blue-700 bg-blue-50 border-blue-200 hover:border-blue-300'
            case 'Lost': return 'text-rose-700 bg-rose-50 border-rose-200 hover:border-rose-300'
            default: return 'text-amber-700 bg-amber-50 border-amber-200 hover:border-amber-300'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Lead Pipeline</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Manage and track lifecycle transitions across your active portfolio.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border text-gray-600 border-gray-200 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2">
                        <Filter size={14} /> Pipeline Filters
                    </button>
                    <button onClick={() => { }} disabled className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:opacity-50">
                        <ArrowRight size={14} /> Bulk Update
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-[#111827] uppercase tracking-widest text-xs">Lifecycle Tracking</h3>
                        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                            {stagesData.length} Pipeline Records
                        </span>
                    </div>
                    <div className="relative flex-1 sm:w-80 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search lead profiles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar min-h-[400px]">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-indigo-600 opacity-50">
                            <Loader className="animate-spin mb-4" size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Loading Pipeline Data...</p>
                        </div>
                    ) : filteredStages.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <Activity size={48} className="mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest">No matching leads in pipeline.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-[#E5E7EB]">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Profile</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Lifecycle Stage</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredStages.map((stage) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={stage.id}
                                            className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-white text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm shrink-0">
                                                        {stage.leadName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-[#111827] group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-xs">
                                                            {stage.leadName}
                                                        </div>
                                                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {stage.id.toString().padStart(6, '0')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <select
                                                    value={stage.currentStage}
                                                    onChange={(e) => updateStage.mutate({ leadId: stage.id, stage: e.target.value })}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border appearance-none outline-none cursor-pointer transition-all shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500",
                                                        getStageColorList(stage.currentStage)
                                                    )}
                                                >
                                                    <option>New</option>
                                                    <option>Contacted</option>
                                                    <option>Pending</option>
                                                    <option>Qualified</option>
                                                    <option>Converted</option>
                                                    <option>Lost</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                    <Activity size={12} className="text-gray-300" />
                                                    {stage.lastUpdated}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="px-4 py-2 border border-indigo-100 bg-indigo-50 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all shadow-sm uppercase text-[10px] font-black tracking-widest inline-flex items-center gap-1">
                                                    View Story <ChevronRight size={12} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeadStages
