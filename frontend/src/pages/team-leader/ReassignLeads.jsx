import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    UserCheck,
    Search,
    Filter,
    Clock,
    User,
    Globe,
    RefreshCcw,
    CheckSquare,
    Square
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTeamLeaderActions } from '../../hooks/useTeamLeaderActions'

const ReassignLeads = () => {
    const { useReassignList, reassignLead, usePerformance, refreshData } = useTeamLeaderActions()
    const { data: leads, isLoading } = useReassignList()
    const { data: performance } = usePerformance()
    const leaderboard = performance?.data || []
    const refreshList = refreshData('reassignList')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLeads, setSelectedLeads] = useState([])
    const [bulkCounselor, setBulkCounselor] = useState('')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const reassignList = leads?.data?.leads || []
    const filteredList = reassignList.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.assignedTo?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.country || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectAll = () => {
        if (selectedLeads.length === filteredList.length) {
            setSelectedLeads([])
        } else {
            setSelectedLeads(filteredList.map(l => l.id))
        }
    }

    const handleSelectLead = (id) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(lId => lId !== id))
        } else {
            setSelectedLeads([...selectedLeads, id])
        }
    }

    const handleSingleReassign = (leadId, assignedToId) => {
        if (!assignedToId) return
        reassignLead.mutate({ leadIds: [leadId], assignedToId: Number(assignedToId) })
    }

    const handleBulkReassign = () => {
        if (!bulkCounselor || selectedLeads.length === 0) return
        reassignLead.mutate({ leadIds: selectedLeads, assignedToId: Number(bulkCounselor) })
        setSelectedLeads([])
        setBulkCounselor('')
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Reassign <span className="text-indigo-600">Leads</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Manage portfolio distribution and load balancing</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm hidden sm:flex">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Counselor Workload: Balanced</span>
                    </div>
                    <button
                        onClick={() => refreshList.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} className={refreshList.isPending ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Bulk Action Panel */}
            <AnimatePresence>
                {selectedLeads.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-indigo-600 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-600/20"
                    >
                        <div className="flex items-center gap-3 text-white">
                            <div className="bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center font-black">
                                {selectedLeads.length}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Leads Selected for Bulk Reassignment</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <select
                                value={bulkCounselor}
                                onChange={(e) => setBulkCounselor(e.target.value)}
                                className="flex-1 sm:w-48 bg-indigo-700 border border-indigo-500 text-white rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-white/20"
                            >
                                <option value="" disabled className="text-indigo-300">Select Target Counselor</option>
                                {COUNSELORS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <button
                                onClick={handleBulkReassign}
                                disabled={!bulkCounselor || reassignLead.isPending}
                                className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 whitespace-nowrap"
                            >
                                {reassignLead.isPending ? <RefreshCcw size={14} className="animate-spin" /> : <UserCheck size={14} />}
                                Transfer Leads
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH BY LEAD OR CURRENT COUNSELOR..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-6 py-5 w-12 text-center">
                                    <button onClick={handleSelectAll} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                        {selectedLeads.length > 0 && selectedLeads.length === filteredList.length ? (
                                            <CheckSquare size={18} className="text-indigo-600" />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </button>
                                </th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Current Counselor</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Country</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Status / Last Activity</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Reassign To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredList.map((lead, i) => {
                                const isSelected = selectedLeads.includes(lead.id)
                                return (
                                    <tr key={lead.id} className={cn(
                                        "transition-all group",
                                        isSelected ? "bg-indigo-50/30" : "hover:bg-gray-50/50"
                                    )}>
                                        <td className="px-6 py-6 text-center">
                                            <button onClick={() => handleSelectLead(lead.id)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                {isSelected ? (
                                                    <CheckSquare size={18} className="text-indigo-600" />
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-6">
                                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{lead.name}</span>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                                                    {(lead.assignedTo?.name || 'U').charAt(0)}
                                                </div>
                                                <span className="text-[10px] font-black text-[#111827] uppercase">{lead.assignedTo?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                                                <Globe size={10} /> {lead.country || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={cn(
                                                    "w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200"
                                                )}>
                                                    {lead.stage}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                                                    <Clock size={10} /> {new Date(lead.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end relative">
                                                <select
                                                    value=""
                                                    onChange={(e) => handleSingleReassign(lead.id, e.target.value)}
                                                    className="w-48 bg-white border border-gray-200 text-[#111827] rounded-xl px-4 py-2 cursor-pointer text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none transition-all hover:border-indigo-300"
                                                >
                                                    <option value="" disabled>Select Counselor...</option>
                                                    {leaderboard.filter(c => c.id !== lead.assignedToId).map(c => (
                                                        <option key={c.id} value={c.id}>{c.counselor}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <UserCheck size={12} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default ReassignLeads
