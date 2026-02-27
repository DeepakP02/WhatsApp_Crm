import React, { useState } from 'react'
import {
    Plus,
    Database,
    Globe,
    Trash2,
    Zap,
    ShieldCheck,
    Settings2,
    Link,
    Activity,
    CheckCircle2,
    AlertCircle,
    Share2,
    Cpu,
    ExternalLink,
    RefreshCw,
    X,
    Server
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import mockApi from '../lib/mockApi'
import { useIntegrationActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'

const IntegrationCard = React.forwardRef(({ integration, onTest, onDelete }, ref) => (
    <motion.tr
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hover:bg-gray-50/50 transition-all group"
    >
        <td className="px-8 py-6">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                    integration.name === 'HubSpot' ? "bg-orange-50 text-orange-600" :
                        integration.name === 'Salesforce' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                )}>
                    {integration.name === 'HubSpot' ? <Database size={24} /> :
                        integration.name === 'Salesforce' ? <Cpu size={24} /> : <Share2 size={24} />}
                </div>
                <div>
                    <div className="font-black text-[#111827] uppercase tracking-tight text-xs">{integration.name} Node</div>
                    <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-0.5">
                        <Link size={12} className="text-gray-300" />
                        {integration.url}
                    </div>
                </div>
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="flex items-center gap-2">
                <Server size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    {integration.name.includes('Webhook') ? 'REST API' : 'OAuth 2.0'}
                </span>
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="flex items-center gap-3">
                <div className={cn("h-1.5 w-1.5 rounded-full", integration.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300')} />
                <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                    integration.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                )}>
                    {integration.status}
                </span>
            </div>
        </td>
        <td className="px-8 py-6 text-right">
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                    onClick={() => onTest(integration.id)}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-90"
                    title="Test Protocol"
                >
                    <RefreshCw size={14} />
                </button>
                <button
                    onClick={() => onDelete(integration.id)}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-90"
                    title="Sever Connection"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </td>
    </motion.tr>
))

const CrmIntegration = () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const { addIntegration, deleteIntegration, testConnection } = useIntegrationActions()

    const { data: integrations = [], isLoading } = useQuery({
        queryKey: ['integrations'],
        queryFn: () => mockApi.admin.integrations.get().then(res => res.data)
    })

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight flex items-center gap-3">
                        <Share2 className="text-indigo-600" size={32} />
                        CRM Ecosystem
                    </h1>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Global lead synchronization and master record orchestration.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-4 bg-[#111827] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-indigo-100 active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} />
                    Establish Integration
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-[#F9FAFB]/50">
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Master Identity</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Protocol Type</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Sync State</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Governance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]/50">
                                    <AnimatePresence mode='popLayout'>
                                        {integrations.map((int) => (
                                            <IntegrationCard
                                                key={int.id}
                                                integration={int}
                                                onTest={testConnection.mutate}
                                                onDelete={deleteIntegration.mutate}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {integrations.length === 0 && !isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100">
                                    <Database size={32} className="text-gray-200" />
                                </div>
                                <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest">No Active Nodes</h3>
                                <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-tighter">Initialize a CRM connection to start lead synchronization</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-[#111827] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="relative z-10">
                            <Activity className="text-indigo-400 mb-8 group-hover:scale-110 transition-transform" size={40} />
                            <h3 className="font-black text-lg mb-4 uppercase tracking-tight">Sync Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uptime</span>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">99.98%</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Latency</span>
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">240ms</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Failed Packets</span>
                                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">0.02%</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                            <Cpu size={240} />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-[#E5E7EB] shadow-sm relative overflow-hidden group">
                        <h3 className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">
                            Supported Ecosystems
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {['HubSpot', 'Salesforce', 'Custom Webhook', 'Zapier', 'Make.com', 'Pipedrive'].map(tech => (
                                <div key={tech} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{tech}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            POVA-CRM uses standard REST protocols and secure OAuth flows for all external sync operations.
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl">
                            <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Provision CRM Node</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Establishing secure data synchronization</p>
                                </div>
                                <button onClick={() => setShowAddForm(false)} className="text-gray-300 hover:text-[#111827] transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); addIntegration.mutate(Object.fromEntries(new FormData(e.target))); setShowAddForm(false); }} className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Integration Identity</label>
                                    <input name="name" required placeholder="HUBSPOT MAIN PRODUCTION" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all placeholder:text-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">CRM Logic Provider</label>
                                    <select name="type" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                        <option>HubSpot (REST OAuth)</option>
                                        <option>Salesforce (Lightning API)</option>
                                        <option>Custom Webhook (JSON)</option>
                                        <option>Pipedrive API</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Master Endpoint / Client Domain</label>
                                    <div className="relative">
                                        <Link size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input name="url" required placeholder="https://api.hubapi.com/v1" className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all placeholder:text-gray-200" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Access Token / Private Key</label>
                                    <input name="key" type="password" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Abort Protocol</button>
                                    <button type="submit" className="px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Establish Link</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CrmIntegration
