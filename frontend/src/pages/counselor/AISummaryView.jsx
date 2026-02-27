import React, { useState } from 'react'
import { Search, Loader, Bot, Sparkles, Filter, ShieldCheck, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import counselorApi from '../../api/counselor.api.js'

const AISummaryView = () => {
    const [searchTerm, setSearchTerm] = useState('')

    const { data: aiResp, isLoading } = useQuery({
        queryKey: ['counselor-ai-summary'],
        queryFn: () => counselorApi.fetchAllQualifications()
    })

    const summaryData = (Array.isArray(aiResp?.data) ? aiResp.data : []).map(q => ({
        id: q.id,
        leadName: q.lead?.name || 'Unknown',
        country: q.lead?.country || '--',
        score: q.lead?.score || q.score,
        category: q.category.charAt(0) + q.category.slice(1).toLowerCase(),
        program: q.lead?.program || '--',
        budget: q.lead?.budget ? `$${q.lead.budget}` : '--',
        intake: q.lead?.intake || '--',
    }))

    const filteredData = summaryData.filter(s =>
        s.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.program.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter flex items-center gap-3">
                        Machine Intelligence
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] rounded-full uppercase tracking-widest shadow-sm">Beta</span>
                    </h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Review conversational AI qualification summaries and lead propensities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                        <Sparkles size={14} /> Refine Algorithm
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/50 to-indigo-50/20">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-[#111827] uppercase tracking-widest text-xs flex items-center gap-2">
                            <Bot size={14} className="text-indigo-500" /> Automated Extraction
                        </h3>
                    </div>
                    <div className="relative flex-1 sm:w-80 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search summaries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px] bg-slate-50/30">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center text-indigo-600 opacity-50">
                                <Loader className="animate-spin mb-4" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Parsing Intelligence Graphs...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 opacity-50">
                                <Bot size={48} className="mb-4" />
                                <p className="text-[11px] font-black uppercase tracking-widest">No Intelligence Profiles Found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <AnimatePresence>
                                    {filteredData.map((data) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={data.id}
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group overflow-hidden"
                                        >
                                            <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gradient-to-br from-white to-gray-50/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center font-black text-lg border border-gray-200 shadow-inner shrink-0">
                                                        {data.leadName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-[#111827] uppercase tracking-tight flex items-center gap-1.5">
                                                            {data.leadName}
                                                            {data.score > 80 && <ShieldCheck size={14} className="text-emerald-500" />}
                                                        </h4>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{data.country}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidence Score</span>
                                                        <span className={cn(
                                                            "text-xl font-black bg-clip-text text-transparent",
                                                            data.score > 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                                                data.score > 50 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                                                    'bg-gradient-to-r from-indigo-500 to-indigo-600'
                                                        )}>
                                                            {data.score || '--'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className={cn(
                                                            "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                                                            data.category === 'Hot' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                data.category === 'Warm' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                        )}>Propensity: {data.category}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Zap size={10} className="text-indigo-400" /> Target Context</span>
                                                    <p className="text-xs font-black text-[#111827]">{data.program}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Financial Bandwidth</span>
                                                    <p className="text-xs font-black text-[#111827]">{data.budget}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enrollment Timeline</span>
                                                    <p className="text-xs font-black text-[#111827]">{data.intake}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qualification Log</span>
                                                    <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline hover:text-indigo-800 transition-all text-left">View full transcript &rarr;</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AISummaryView
