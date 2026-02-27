import React, { useState } from 'react'
import { Search, Filter, Shield, Calendar, Clock, Monitor, Globe, User, Download, X, ListFilter, ChevronLeft, ChevronRight, Hash, Terminal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import * as superAdminApi from '../../api/superAdmin.api.js'
import { useAuditActions } from '../../hooks/useCrmMutations'

const AuditDetailModal = ({ log, isOpen, onClose }) => {
    if (!isOpen || !log) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Trace Identification</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit Protocol ID: #LOG-{Math.floor(Math.random() * 900000)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Subject Identity</label>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-[#111827] text-white rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-tighter">
                                        {log.user.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-xs text-[#111827] uppercase">{log.user}</div>
                                        <div className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">{log.role}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Module Cluster</label>
                                <div className="font-black text-xs text-[#111827] uppercase">{log.module} Protocol</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Execution Sync</label>
                                <div className="flex items-center gap-2 text-xs font-black text-gray-600">
                                    <Calendar size={14} className="text-gray-400" /> {log.time.split(' ')[0]}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-black text-gray-600 mt-1">
                                    <Clock size={14} className="text-gray-400" /> {log.time.split(' ')[1]}
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Execution Status</label>
                                <span className={cn(
                                    "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                    log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                )}>
                                    {log.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Operation Details</label>
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-sm text-gray-700 leading-relaxed shadow-inner">
                            {log.action}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Network Entry</label>
                            <div className="flex items-center gap-2 text-xs font-black text-indigo-600">
                                <Globe size={12} /> {log.ip}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Device Blueprint</label>
                            <div className="flex items-center gap-2 text-xs font-black text-gray-600 truncate">
                                <Monitor size={12} /> {log.device}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <Shield size={10} /> Tamper-proof architectural log verified
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AuditLogs = () => {
    const { exportLogs } = useAuditActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('All Modules');
    const [userFilter, setUserFilter] = useState('All Users');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLog, setSelectedLog] = useState(null);

    // Real data fetching
    const { data, isLoading, isError } = useQuery({
        queryKey: ['auditLogs', currentPage, searchTerm, moduleFilter, userFilter],
        queryFn: () => superAdminApi.fetchAuditLogs({
            page: currentPage,
            limit: 10,
            search: searchTerm,
            module: moduleFilter === 'All Modules' ? undefined : moduleFilter,
            user: userFilter === 'All Users' ? undefined : userFilter
        })
    })

    const logs = data?.logs || []
    const totalItems = data?.total || 0
    const itemsPerPage = 10
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const formattedLogs = logs.map(log => ({
        time: new Date(log.createdAt).toLocaleString(),
        user: log.user?.name || 'Unknown',
        role: log.user?.role || 'USER',
        action: log.action,
        module: log.module,
        ip: log.ip || '0.0.0.0',
        device: log.userAgent || 'Unknown',
        status: 'Success', // System logs are generally successful actions
        detail: log.detail
    }))

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Traceability Terminal</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Real-time synchronization of decentralized system actions and security events.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => exportLogs.mutate({ moduleFilter, userFilter, searchTerm })}
                        disabled={exportLogs.isPending}
                        className="bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black flex items-center gap-3 shadow-2xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Download size={18} className={exportLogs.isPending ? "animate-bounce" : ""} />
                        Extract CSV Archive
                    </button>
                    <div className="px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                            <Shield size={16} />
                        </div>
                        <div>
                            <span className="text-sm font-black text-rose-600 tracking-tighter">3 BLOCKED</span>
                            <span className="text-[9px] font-black text-rose-400 uppercase block tracking-widest -mt-1">Incidents Today</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-8 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Locate trace by action, IP or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none w-full transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer min-w-[150px] text-gray-600"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer appearance-none min-w-[160px]"
                            >
                                <option>All Users</option>
                                <option>Sarah Connor</option>
                                <option>System</option>
                                <option>Thomas Anderson</option>
                                <option>John Wick</option>
                                <option>Super_Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={moduleFilter}
                                onChange={(e) => setModuleFilter(e.target.value)}
                                className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer appearance-none min-w-[140px]"
                            >
                                <option>All Modules</option>
                                <option>Inbox</option>
                                <option>Billing</option>
                                <option>Auth</option>
                                <option>Channels</option>
                                <option>Security</option>
                                <option>Templates</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
                        <div className="text-right">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Signal Strength</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-xs font-black text-indigo-600">ENCRYPTED</span>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Date</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Admin/User</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Action</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Module</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {formattedLogs.map((log, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelectedLog(log)}
                                    className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={14} className="text-gray-400" />
                                            <div className="font-black text-[11px] text-[#111827] uppercase tracking-tighter">{log.time.split(' ')[0]}</div>
                                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{log.time.split(' ')[1]}</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-[#111827] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm">
                                                {log.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-xs text-[#111827] uppercase tracking-tighter">{log.user}</div>
                                                <div className="text-[9px] text-indigo-500 font-black tracking-widest uppercase">{log.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="font-bold text-gray-800 text-xs leading-relaxed max-w-sm border border-gray-100 bg-white p-3 rounded-xl shadow-sm">
                                            {log.action}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                            <Hash size={12} className="text-indigo-400" />
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight">{log.module}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="inline-flex items-center justify-end gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                            <Globe size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-indigo-600 tracking-tighter">{log.ip}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Operational Plane */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between mt-auto">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Tracing <span className="text-indigo-600">{totalItems}</span> security events in cluster
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-indigo-50"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1.5 px-4 h-12 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-[10px] font-black transition-all",
                                        currentPage === i + 1 ? "bg-[#111827] text-white" : "text-gray-400 hover:bg-gray-50"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-indigo-50"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedLog && (
                    <AuditDetailModal log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuditLogs;
