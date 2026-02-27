import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    Search,
    Filter,
    Clock,
    User,
    RefreshCcw,
    BellRing,
    ChevronRight,
    UserCheck
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTeamLeaderActions } from '../../hooks/useTeamLeaderActions'

const SlaAlerts = () => {
    const { useSlaAlerts, sendReminder, reassignLead, usePerformance, refreshData } = useTeamLeaderActions()
    const { data: alerts, isLoading } = useSlaAlerts()
    const { data: performance } = usePerformance()
    const leaderboard = performance?.data || []
    const refreshAlerts = refreshData('slaAlerts')

    const [searchQuery, setSearchQuery] = useState('')
    const [reassignModalOpen, setReassignModalOpen] = useState(false)
    const [selectedAlert, setSelectedAlert] = useState(null)
    const [assignedToId, setAssignedToId] = useState('')

    if (isLoading) return (
        <div className="h-96 flex items-center justify-center">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
        </div>
    )

    const slaAlerts = alerts?.data || []
    const filteredAlerts = slaAlerts.filter(a =>
        a.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.counselor.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleReassign = () => {
        if (!assignedToId || !selectedAlert) return
        reassignLead.mutate({ leadIds: [selectedAlert.id], assignedToId: Number(assignedToId) })
        setReassignModalOpen(false)
        setSelectedAlert(null)
        setAssignedToId('')
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">SLA <span className="text-rose-600">Alerts</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Service Level Agreement breach monitoring</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm hidden sm:flex">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Status Filter: Active Breaches</span>
                    </div>
                    <button
                        onClick={() => refreshAlerts.mutate()}
                        className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#111827] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} className={refreshAlerts.isPending ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative group max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH INCIDENTS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest w-full focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 shadow-sm whitespace-nowrap">
                        <AlertTriangle size={14} />
                        {slaAlerts.filter(a => a.status === 'Breached').length} Active Breaches
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">SLA Status</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Lead Profile</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Responsible</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Response Delay</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">SLA Threshold</th>
                                <th className="px-4 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Intervention</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredAlerts.map((alert, i) => (
                                <tr key={alert.id} className={cn(
                                    "transition-all group border-l-4",
                                    alert.status === 'Breached' ? "border-l-rose-500 bg-rose-50/10 hover:bg-rose-50/30" : "border-l-amber-400 hover:bg-gray-50/50"
                                )}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {alert.status === 'Breached' ? (
                                                <div className="flex items-center gap-1.5 text-rose-600 animate-pulse">
                                                    <AlertTriangle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Breached</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-600">
                                                    <Clock size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Warning</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-tight",
                                            alert.status === 'Breached' ? "text-rose-900" : "text-[#111827]"
                                        )}>{alert.leadName}</span>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                                            Breach Time: {alert.breachTime}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                                                {(alert.counselor || 'U').charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-black text-[#111827] uppercase">{alert.counselor}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-xs font-black",
                                            alert.status === 'Breached' ? "text-rose-600" : "text-amber-600"
                                        )}>{alert.delay} mins</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black text-gray-500">{alert.limit} mins limit</span>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => sendReminder.mutate(alert.counselor)}
                                                className={cn(
                                                    "p-2 rounded-lg transition-colors border shadow-sm flex items-center gap-2 ",
                                                    alert.status === 'Breached' ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100" : "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100"
                                                )}
                                                title="Send Urgent Reminder"
                                            >
                                                <BellRing size={14} className={alert.status === 'Breached' ? "animate-bounce" : ""} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Ping</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedAlert(alert)
                                                    setReassignModalOpen(true)
                                                }}
                                                className="w-8 h-8 shrink-0 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-110"
                                                title="Reassign to another counselor"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Quick Reassign Modal for SLA Breaches */}
            <AnimatePresence>
                {reassignModalOpen && selectedAlert && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setReassignModalOpen(false)
                                setSelectedAlert(null)
                                setNewCounselor('')
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl p-8 space-y-6 text-center"
                        >
                            <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                                <AlertTriangle size={24} />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-[#111827] uppercase tracking-tighter">Emergency Reassign</h3>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                    SLA breached for <span className="text-indigo-600">{selectedAlert.leadName}</span>.<br /> Currently with {selectedAlert.counselor}.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 text-left space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Assignment</label>
                                <select
                                    value={assignedToId}
                                    onChange={(e) => setAssignedToId(e.target.value)}
                                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                >
                                    <option value="" disabled>Select available counselor...</option>
                                    {leaderboard
                                        .filter(c => c.counselor !== selectedAlert.counselor)
                                        .map(c => <option key={c.id} value={c.id}>{c.counselor}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setReassignModalOpen(false)
                                        setSelectedAlert(null)
                                        setAssignedToId('')
                                    }}
                                    className="flex-1 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReassign}
                                    disabled={!assignedToId || reassignLead.isPending}
                                    className="flex-[2] bg-rose-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200 disabled:opacity-50"
                                >
                                    {reassignLead.isPending ? (
                                        <RefreshCcw size={14} className="animate-spin" />
                                    ) : (
                                        <>Transfer & Trigger Alert</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SlaAlerts
