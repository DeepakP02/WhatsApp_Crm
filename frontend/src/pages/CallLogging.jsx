import React, { useState } from 'react'
import { PhoneCall, PhoneIncoming, PhoneOutgoing, Clock, Search, Loader, Plus, Calendar as CalendarIcon, FileEdit } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useCounselorActions } from '../hooks/useCrmMutations'
import counselorApi from '../api/counselor.api.js'

const CallLogging = () => {
    const { logCall } = useCounselorActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [isLogModalOpen, setIsLogModalOpen] = useState(false)
    const [newCallData, setNewCallData] = useState({
        leadId: '', type: 'Outgoing', duration: '', outcome: 'Interested', notes: ''
    })

    const { data: callsResp, isLoading } = useQuery({
        queryKey: ['counselor-calls'],
        queryFn: () => counselorApi.fetchAllCalls()
    })

    const { data: leadsResp } = useQuery({
        queryKey: ['counselor-leads'],
        queryFn: () => counselorApi.fetchLeads()
    })

    const callsData = (Array.isArray(callsResp?.data) ? callsResp.data : []).map(c => ({
        id: c.id,
        date: new Date(c.calledAt).toLocaleDateString(),
        time: new Date(c.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lead: c.lead?.name || 'Unknown',
        status: c.user?.name || 'Counselor',
        type: 'Outgoing', // Backend CallLog doesn't have direction yet, default to Outgoing
        duration: c.duration ? `${Math.floor(c.duration / 60)}m ${c.duration % 60}s` : '0m',
        notes: c.notes || 'No notes',
        outcome: c.outcome || 'No Outcome'
    }))

    const leadsList = Array.isArray(leadsResp?.data) ? leadsResp.data : []

    const filteredCalls = callsData.filter(c =>
        c.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleLogCall = () => {
        if (!newCallData.leadId || !newCallData.duration) return;

        // Parse duration "12m 30s" to seconds
        const match = newCallData.duration.match(/(\d+)m\s*(\d*)s*/);
        const durationSec = match ? (parseInt(match[1]) * 60 + (parseInt(match[2]) || 0)) : 300;

        logCall.mutate({
            leadId: Number(newCallData.leadId),
            duration: durationSec,
            outcome: newCallData.outcome,
            notes: newCallData.notes
        }, {
            onSuccess: () => {
                setIsLogModalOpen(false)
                setNewCallData({ leadId: '', type: 'Outgoing', duration: '', outcome: 'Interested', notes: '' })
            }
        })
    }

    const totalOutgoing = callsData.filter(c => c.type === 'Outgoing').length
    const totalIncoming = callsData.filter(c => c.type === 'Incoming').length

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Call Activity</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Review communication records and log ad-hoc voice touchpoints.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLogModalOpen(true)}
                        className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                    >
                        <Plus size={14} /> Log Communication
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-[10px] uppercase tracking-widest border border-indigo-100 shadow-sm">
                            <PhoneOutgoing size={12} />
                            <span>{totalOutgoing} Outbound</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm">
                            <PhoneIncoming size={12} />
                            <span>{totalIncoming} Inbound</span>
                        </div>
                    </div>
                    <div className="relative flex-1 sm:w-80 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search lead or notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-indigo-600 opacity-50">
                            <Loader className="animate-spin mb-4" size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Compiling Communications...</p>
                        </div>
                    ) : filteredCalls.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <PhoneCall size={48} className="mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest">No Communication Records Found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-[#E5E7EB]">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Profile</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Direction / Duration</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[200px]">Context Notes</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Outcome</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredCalls.map((call, i) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={call.id || i}
                                            className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="font-black text-[#111827] text-xs">{call.date}</div>
                                                <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5 font-bold uppercase tracking-widest">
                                                    <Clock size={10} /> {call.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-black text-[#3B5BDB] uppercase tracking-tight text-xs">{call.lead}</div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">By {call.status}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    {call.type === 'Outgoing' ? <PhoneOutgoing size={12} className="text-gray-400" /> : <PhoneIncoming size={12} className="text-indigo-500" />}
                                                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-600">{call.type}</span>
                                                </div>
                                                <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-bold">{call.duration}</span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-[11px] font-medium leading-relaxed italic truncate max-w-[250px]">
                                                "{call.notes}"
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                                    call.outcome === 'Qualified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        call.outcome === 'Interested' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                            call.outcome === 'Follow-up' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-gray-50 text-gray-500 border-gray-200'
                                                )}>
                                                    {call.outcome}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Log Call Modal */}
            <AnimatePresence>
                {isLogModalOpen && (
                    <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={() => setIsLogModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
                            >
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                    <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                                        <PhoneCall size={18} className="text-indigo-600" /> Dispatch Log
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Lead Profile</label>
                                        <select
                                            value={newCallData.leadId}
                                            onChange={(e) => setNewCallData({ ...newCallData, leadId: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option value="">Select Lead...</option>
                                            {leadsList.map(l => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Direction</label>
                                            <select
                                                value={newCallData.type}
                                                onChange={(e) => setNewCallData({ ...newCallData, type: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                            >
                                                <option>Outgoing</option>
                                                <option>Incoming</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 12m 30s"
                                                value={newCallData.duration}
                                                onChange={(e) => setNewCallData({ ...newCallData, duration: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Outcome Mapping</label>
                                        <select
                                            value={newCallData.outcome}
                                            onChange={(e) => setNewCallData({ ...newCallData, outcome: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option>Interested</option>
                                            <option>Qualified</option>
                                            <option>Follow-up</option>
                                            <option>Not Interested</option>
                                            <option>No Answer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Verbatim Notes</label>
                                        <textarea
                                            placeholder="Add conversation summary..."
                                            value={newCallData.notes}
                                            onChange={(e) => setNewCallData({ ...newCallData, notes: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm h-24 resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end pt-4">
                                        <button
                                            onClick={() => setIsLogModalOpen(false)}
                                            className="px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleLogCall}
                                            disabled={logCall.isPending || !newCallData.leadId || !newCallData.duration}
                                            className="px-5 py-2.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {logCall.isPending ? <Loader size={14} className="animate-spin" /> : 'Commit Log'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CallLogging
