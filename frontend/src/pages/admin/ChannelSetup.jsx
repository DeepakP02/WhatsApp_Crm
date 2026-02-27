import React, { useState } from 'react'
import { Phone, Facebook, MousePointer2, Plus, Filter, Globe, Calendar, Clock, Link2, Trash2, Shield, Power, Copy, CheckCircle, Smartphone, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../../api/admin.api.js'
import { useAdminActions } from '../../hooks/useCrmMutations'

const TabButton = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-8 py-5 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-2",
            active
                ? "text-indigo-600 border-indigo-600 bg-indigo-50/30"
                : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50/50"
        )}
    >
        <Icon size={16} strokeWidth={2.5} />
        {label}
    </button>
)

const GenerateScriptModal = ({ widget, onClose }) => {
    const [copied, setCopied] = useState(false)
    const scriptCode = `<!-- POVA CRM Widget -->\n<script src="https://cdn.pova.io/widget.js?id=${widget?.id * 734}"></script>\n<script>\n  window.PovaWidget.init({ domain: "${widget?.domain}" });\n</script>`

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Deployment Script</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Widget ID: #PX-{widget?.id * 921}</p>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <p className="text-xs font-medium text-gray-500 leading-relaxed uppercase tracking-widest">Copy the following snippet and paste it before the closing <code>&lt;/body&gt;</code> tag of your website.</p>
                    <div className="relative">
                        <pre className="bg-[#111827] text-indigo-300 p-6 rounded-2xl text-[10px] font-mono leading-relaxed overflow-x-auto border border-white/10">
                            {scriptCode}
                        </pre>
                        <button onClick={handleCopy} className="absolute right-4 top-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 group">
                            {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white group-hover:scale-110 transition-transform" />}
                        </button>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                        <Code className="text-emerald-500" size={18} />
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest leading-none">Security: HTTPS Protocol Required</p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <button onClick={onClose} className="w-full bg-[#111827] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Close Terminal</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const ChannelSetup = () => {
    const [activeTab, setActiveTab] = useState('whatsapp')
    const [showAddForm, setShowAddForm] = useState(false)
    const [scriptWidget, setScriptWidget] = useState(null)
    const { connectChannel, disconnectChannel } = useAdminActions()

    const { data: channels = [], isLoading } = useQuery({
        queryKey: ['channels', activeTab],
        queryFn: async () => {
            const data = await adminApi.fetchChannelStats();
            // In the real DB we have 'channels' array and the individual counts. Let's extract the real channels array.
            const allChannels = data.channels || [];

            // Map the db names to tab types
            const tabFilters = {
                whatsapp: 'WHATSAPP',
                facebook: 'MESSENGER',
                website: 'WIDGET'
            };

            // Filter by activeTab
            // If the table is empty, we provide a placeholder so the table renders something
            const filtered = allChannels.filter(c => c.type === tabFilters[activeTab]);
            if (filtered.length === 0) {
                return [{ id: 'mock1', name: `Primary ${activeTab} Node`, type: tabFilters[activeTab], isActive: false, status: 'Inactive', country: 'Global' }];
            }
            return filtered;
        }
    })


    const queueData = Array.isArray(channels?.data) ? channels.data : (Array.isArray(channels) ? channels : [])

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Channel Setup</h1>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Provision and manage multi-protocol communication nodes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <TabButton active={activeTab === 'whatsapp'} label="WhatsApp" icon={Phone} onClick={() => setActiveTab('whatsapp')} />
                    <TabButton active={activeTab === 'facebook'} label="Facebook" icon={Facebook} onClick={() => setActiveTab('facebook')} />
                    <TabButton active={activeTab === 'website'} label="Website Widget" icon={MousePointer2} onClick={() => setActiveTab('website')} />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-[#E5E7EB] bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="font-black text-[#111827] text-xs uppercase tracking-[0.2em]">{activeTab} Node terminal</h3>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">Active orchestration of {activeTab} instances</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:text-indigo-600 transition-all shadow-sm">
                            <Filter size={14} />
                            Filter by Country
                        </button>
                        {activeTab === 'whatsapp' && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100"
                            >
                                <Plus size={14} strokeWidth={3} />
                                Add Number
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                {activeTab === 'whatsapp' && (
                                    <>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Identity / Number</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Provision Date</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Telemetry</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">State</th>
                                    </>
                                )}
                                {activeTab === 'facebook' && (
                                    <>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Page Identity</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Page ID</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Provision Date</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">State</th>
                                    </>
                                )}
                                {activeTab === 'website' && (
                                    <>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Asset Name</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Domain Node</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Throughput</th>
                                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">State</th>
                                    </>
                                )}
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {(channels.data || channels).map((channel) => (
                                <tr key={channel.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-black text-xs text-[#111827] uppercase tracking-tight">{channel.number || channel.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{channel.client || channel.domain}</div>
                                        </div>
                                    </td>
                                    {activeTab === 'facebook' && <td className="px-8 py-6 font-mono text-[10px] font-bold text-gray-600">{channel.pageId}</td>}
                                    {activeTab === 'website' && <td className="px-8 py-6 font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{channel.domain}</td>}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Globe size={12} className="text-gray-300" />
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{channel.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{channel.date || `${channel.leadsToday} Leads Today`}</span>
                                    </td>
                                    {activeTab === 'whatsapp' && (
                                        <td className="px-8 py-6">
                                            {channel.lastSeen ? <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Last Pulsed: {channel.lastSeen}</span> : <span className="text-gray-300">-</span>}
                                        </td>
                                    )}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", (channel.status === 'Connected' || channel.status === 'Active') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500')} />
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                                (channel.status === 'Connected' || channel.status === 'Active') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                            )}>
                                                {channel.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 transition-all">
                                            {activeTab === 'website' && (
                                                <button onClick={() => setScriptWidget(channel)} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-90" title="Generate Script">
                                                    <Code size={14} strokeWidth={2.5} />
                                                </button>
                                            )}
                                            {(activeTab === 'whatsapp' || activeTab === 'facebook' || activeTab === 'website') && (
                                                <button
                                                    onClick={() => {
                                                        if (channel.isActive || channel.status === 'Connected' || channel.status === 'Active') {
                                                            disconnectChannel.mutate(activeTab);
                                                        } else {
                                                            connectChannel.mutate(activeTab);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "p-2.5 bg-white border border-gray-100 rounded-xl transition-all shadow-sm active:scale-90",
                                                        (channel.isActive || channel.status === 'Connected' || channel.status === 'Active') ? "text-rose-500 hover:border-rose-100" : "text-emerald-500 hover:border-emerald-100"
                                                    )}
                                                    title={(channel.isActive || channel.status === 'Connected' || channel.status === 'Active') ? 'Disconnect Node' : 'Initialize Connection'}
                                                >
                                                    <Power size={14} strokeWidth={2.5} />
                                                </button>
                                            )}
                                            <button
                                                className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-90 opacity-50 cursor-not-allowed"
                                                title="Delete Instance (Not implemented in demo)"
                                            >
                                                <Trash2 size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Provision Node</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Establishing new WhatsApp protocol</p>
                                </div>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); addChannel.mutate(Object.fromEntries(new FormData(e.target))); setShowAddForm(false); }} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Number Sequence</label>
                                        <input name="number" required placeholder="+91 XXXX XXXX" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Node Territory</label>
                                        <select name="country" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                            <option>UAE</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Webhook Endpoint</label>
                                        <div className="relative">
                                            <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                            <input name="webhook" required placeholder="https://api.pova.io/v1/hook" className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-black tracking-tight focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Abort</button>
                                    <button type="submit" className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Initialize</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
                {scriptWidget && (
                    <GenerateScriptModal widget={scriptWidget} onClose={() => setScriptWidget(null)} />
                )}
            </AnimatePresence>
        </div >
    )
}

export default ChannelSetup
