import React, { useState } from 'react'
import { Sparkles, Search, ShieldCheck, X, Bot, AlertTriangle, FileText, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import counselorApi from '../../api/counselor.api'

const AiStatus = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLead, setSelectedLead] = useState(null)

    const { data: resp, isLoading } = useQuery({
        queryKey: ['support-ai-status'],
        queryFn: () => counselorApi.fetchAllQualifications()
    })

    const aiData = Array.isArray(resp?.data) ? resp.data : []

    const filteredData = aiData.filter(qual =>
        (qual.lead?.name && qual.lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (qual.lead?.program && qual.lead.program.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleRowClick = (lead) => {
        setSelectedLead(lead)
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                        <Sparkles className="text-indigo-600" /> AI Qualification Status
                    </h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Review automated triage results and AI intelligence summaries.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by profile or program intent..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]">
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Identity Profile</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Confidence Index</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Intent Priority</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Engine Status</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Target Program</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Est. Budget</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            <AnimatePresence>
                                {filteredData.map((qual) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={qual.id}
                                        onClick={() => handleRowClick(qual)}
                                        className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-black text-[#111827] uppercase tracking-tight text-xs flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                                                {qual.lead?.name || 'Unknown'}
                                            </div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">UID-{qual.lead?.id}</div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="font-black text-xs text-[#111827] w-6">{qual.lead?.score || 0}%</div>
                                                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden w-16">
                                                    <div className={cn("h-full", (qual.lead?.score || 0) > 80 ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${qual.lead?.score || 0}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                                                qual.category === 'Hot' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    qual.category === 'Warm' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-slate-50 text-slate-600 border-slate-200"
                                            )}>
                                                {qual.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                {qual.status === 'Processing' ? <Sparkles size={10} className="text-amber-500 animate-pulse" /> : <ShieldCheck size={10} className="text-emerald-500" />}
                                                {qual.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-bold text-[#111827] truncate max-w-[150px] inline-block">{qual.lead?.program}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-bold text-gray-500">{qual.lead?.budget}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">
                                                Analyze Data
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredData.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <Bot size={48} className="text-gray-400 mb-4" />
                                            <p className="text-gray-500 uppercase tracking-widest font-black text-xs">Intelligence Logs Empty.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Detail Drawer/Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                            onClick={() => setSelectedLead(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-100 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                                        <Bot size={18} className="text-indigo-600" /> Intelligence Dossier
                                    </h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Target: {selectedLead.lead?.name}</p>
                                </div>
                                <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors rounded-xl bg-white border border-gray-200">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {/* Summary Card */}
                                <div className="p-5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-sm relative overflow-hidden">
                                    <Sparkles className="absolute -right-4 -bottom-4 text-indigo-100 h-24 w-24 opacity-50" />
                                    <div className="relative z-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Automated Synthesis</h3>
                                        <p className="text-xs font-medium text-[#111827] leading-relaxed">
                                            Lead demonstrates extremely high intent for the <strong>{selectedLead.lead?.program}</strong> program starting <strong>{selectedLead.lead?.intake || 'N/A'}</strong>. Budget alignment is confirmed at <strong>{selectedLead.lead?.budget}</strong>. Recommended for immediate human dispatch to close enrollment.
                                        </p>
                                    </div>
                                </div>

                                {/* Extracted Parameters */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#111827] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                        <FileText size={12} className="text-gray-400" /> Extracted Parameters
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence Score</span>
                                            <span className="text-xs font-black text-[#111827]">{selectedLead.lead?.score}%</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Intent Priority</span>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border",
                                                selectedLead.category === 'Hot' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    selectedLead.category === 'Warm' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-slate-50 text-slate-600 border-slate-200"
                                            )}>{selectedLead.category}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Program</span>
                                            <span className="text-[10px] font-bold text-[#111827]">{selectedLead.lead?.program}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Raw Transcript Snippet */}
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#111827] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                        <MessageSquare size={12} className="text-gray-400" /> NLP Transcript Snippets
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100 w-5/6">
                                            <p className="text-[10px] font-medium text-[#111827]">"I am looking to enroll in the MBA program this Fall. I have the funds ready."</p>
                                        </div>
                                        <div className="bg-indigo-50 p-3 rounded-xl rounded-tr-none border border-indigo-100 w-5/6 ml-auto">
                                            <p className="text-[10px] font-medium text-indigo-900">"Excellent. Could you confirm your estimated tuition budget?"</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100 w-5/6">
                                            <p className="text-[10px] font-medium text-[#111827]">"Around {selectedLead.lead?.budget} is what I am expecting to spend."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                <button className="flex-1 py-3 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> Promote to CRM
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AiStatus
