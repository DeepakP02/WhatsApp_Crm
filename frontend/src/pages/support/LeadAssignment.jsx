import React, { useState } from 'react'
import { UserCheck, Search, SearchSlash, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSupportActions } from '../../hooks/useCrmMutations'
import supportApi from '../../api/support.api'

const LeadAssignment = () => {
    const { assignLead } = useSupportActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLead, setSelectedLead] = useState(null)
    const [assignmentData, setAssignmentData] = useState({ team: '', counselor: '', priority: 'Medium' })

    const { data: resp, isLoading } = useQuery({
        queryKey: ['support-queue'],
        queryFn: () => supportApi.fetchUnassignedLeads()
    })

    const { data: counselorsResp } = useQuery({
        queryKey: ['counselors-list'],
        queryFn: () => supportApi.fetchCounselors()
    })
    const counselors = counselorsResp?.data || []

    const leads = Array.isArray(resp?.data) ? resp.data : []

    const filteredLeads = leads.filter(l =>
        (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.country && l.country.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleAssignClick = (lead) => {
        setSelectedLead(lead)
        setAssignmentData({ team: 'Global Operations', counselor: 'John Doe', priority: 'Medium' })
    }

    const handleConfirmAssign = () => {
        if (!selectedLead || !assignmentData.counselor) return;
        assignLead.mutate({
            leadId: selectedLead.id,
            assignedToId: Number(assignmentData.counselor)
        }, {
            onSuccess: () => {
                setSelectedLead(null)
                setAssignmentData({ ...assignmentData, counselor: '' })
            }
        })
    }

    const priorityColors = {
        'High': 'text-rose-600 bg-rose-50 border-rose-100',
        'Medium': 'text-amber-600 bg-amber-50 border-amber-100',
        'Low': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Manual Assignment Panel</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Override routing rules and manually dispatch high-value leads.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find leads requiring manual intervention..."
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
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Current Status</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Origin Source</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">AI Confidence</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Target Deployment</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            <AnimatePresence>
                                {filteredLeads.map((lead) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={lead.id}
                                        className="group hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center font-black text-xs border border-gray-200">
                                                    {(lead.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-[#111827] uppercase tracking-tight text-xs flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors cursor-pointer">
                                                        {lead.name}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{lead.country}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                                                lead.status === 'Hot' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    lead.status === 'Warm' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-slate-50 text-slate-600 border-slate-200"
                                            )}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-bold text-gray-500">{lead.source}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            {lead.score ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="font-black text-xs text-[#111827]">{lead.score}%</div>
                                                    <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden w-16">
                                                        <div className={cn("h-full", lead.score > 80 ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${lead.score}%` }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 italic">Processing</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest",
                                                lead.assignedTo === 'Pending' ? "text-amber-500 animate-pulse" : "text-[#111827]"
                                            )}>
                                                {lead.assignedTo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button onClick={() => handleAssignClick(lead)} className="px-4 py-2 bg-white border border-[#111827] text-[#111827] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111827] hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto">
                                                <UserCheck size={14} /> Dispatch
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredLeads.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <SearchSlash size={48} className="text-gray-400 mb-4" />
                                            <p className="text-gray-500 uppercase tracking-widest font-black text-xs">No leads requiring assignment.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Override Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setSelectedLead(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                                    <AlertCircle size={18} className="text-indigo-600" /> Force Direct Assignment
                                </h2>
                            </div>
                            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Target Identity</p>
                                        <p className="font-bold text-sm text-[#111827]">{selectedLead.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Confidence</p>
                                        <p className="font-bold text-sm text-[#111827]">{selectedLead.score || 0}%</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Operational Division</label>
                                        <select
                                            value={assignmentData.team}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, team: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option>Global Operations</option>
                                            <option>Admissions South</option>
                                            <option>Europe Direct</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Counselor Designation</label>
                                        <select
                                            value={assignmentData.counselor}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, counselor: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option value="">Select Counselor</option>
                                            {counselors.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Escalation Priority</label>
                                        <div className="flex gap-2">
                                            {['High', 'Medium', 'Low'].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setAssignmentData({ ...assignmentData, priority: p })}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                        assignmentData.priority === p ? priorityColors[p] : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={handleConfirmAssign}
                                        disabled={assignLead.isPending}
                                        className="px-5 py-2.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Execute Transfer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LeadAssignment
