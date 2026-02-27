import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Filter, Search, Globe, Power, Play, PauseCircle, Users, Activity, BarChart3, ChevronRight, Hash, ArrowRightLeft, Layers } from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../api/admin.api.js'
import { useAdminActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'

const TabButton = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2",
            active
                ? "text-indigo-600 border-indigo-600 bg-indigo-50/30"
                : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50/50"
        )}
    >
        <Icon size={14} strokeWidth={2.5} />
        {label}
    </button>
)

const RoutingRules = () => {
    const [view, setView] = useState('main') // 'main', 'country', 'round-robin', 'load-based'
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const { createRoutingRule, updateRoutingRule } = useAdminActions()

    const { data: rules = [], isLoading } = useQuery({
        queryKey: ['adminRoutingRules'],
        queryFn: adminApi.fetchRoutingRules
    })

    const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: adminApi.fetchTeams
    })

    const filteredRules = rules.filter(rule =>
        rule.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.team?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const renderMainTable = () => (
        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-[#F9FAFB]/50">
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Operation Team</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor (Primary)</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Architecture</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Max Load</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">State</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50">
                    {filteredRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <Globe size={14} className="text-indigo-400" />
                                    <span className="font-black text-xs text-[#111827] uppercase tracking-tight">{rule.country}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{rule.team?.name}</span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-[#111827] uppercase tracking-tight">ID: {rule.team?.id}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active ID: #{rule.id}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest shadow-sm">
                                    {rule.strategy}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">System Load</span>
                            </td>
                            <td className="px-8 py-6">
                                <button
                                    onClick={() => updateRoutingRule.mutate({ id: rule.id, data: { isActive: !rule.isActive } })}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                                        rule.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50' : 'bg-gray-50 text-gray-400 border-gray-100'
                                    )}
                                >
                                    {rule.isActive ? 'Active' : 'Inactive'}
                                </button>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center justify-end gap-2 transition-all">
                                    <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm active:scale-90 opacity-50"><Edit2 size={14} /></button>
                                    <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 transition-all shadow-sm active:scale-90 opacity-50"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    const renderCountryMapping = () => (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map(rule => (
                <div key={rule.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                            {rule.country.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-[#111827] uppercase tracking-widest">{rule.country}</h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Master Region</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Team</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{rule.team?.name}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Strategy</span>
                            <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{rule.strategy}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    const renderRoundRobin = () => (
        <div className="p-8 space-y-6">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4">
                <Layers className="text-amber-600" size={24} />
                <div>
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">Rotation Terminal</h4>
                    <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">Drag and drop counselors to reorder the distribution sequence.</p>
                </div>
            </div>
            <div className="space-y-3">
                {['Rahul K.', 'Susan V.', 'Ahmed K.', 'Emma W.'].map((name, i) => (
                    <motion.div
                        key={name}
                        whileHover={{ x: 10 }}
                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl cursor-grab active:cursor-grabbing hover:border-indigo-100 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">{i + 1}</div>
                            <span className="text-xs font-black text-[#111827] uppercase tracking-tight">{name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg italic">Wait in Queue</span>
                            <ArrowRightLeft size={14} className="text-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </div>
            <button className="w-full py-4 rounded-2xl bg-[#111827] text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100/50">Save Sequence</button>
        </div>
    )

    const renderLoadBased = () => (
        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-[#F9FAFB]/50">
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Counselor</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Live Pressure</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Max Capacity</th>
                        <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Vibe Check</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50">
                    {[
                        { name: 'Rahul K.', current: 42, max: 50, color: 'bg-indigo-500' },
                        { name: 'Sarah J.', current: 12, max: 50, color: 'bg-emerald-500' },
                        { name: 'John D.', current: 49, max: 50, color: 'bg-rose-500' },
                    ].map(node => (
                        <tr key={node.name} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-6">
                                <span className="font-black text-xs text-[#111827] uppercase tracking-tight">{node.name}</span>
                            </td>
                            <td className="px-8 py-6 min-w-[200px]">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase">
                                        <span>Utilized</span>
                                        <span>{Math.round((node.current / node.max) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000", node.color)} style={{ width: `${(node.current / node.max) * 100}%` }} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6 font-black text-xs text-[#111827]">{node.max}</td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                    node.current > 45 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {node.current > 45 ? 'Full Pressure' : 'Ready to Absorb'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Routing Rules</h1>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Multi-tier distribution architecture and load balancing.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-3 bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Add New Rule
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden min-h-[500px]">
                <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/50">
                    <TabButton active={view === 'main'} label="Main Routing" icon={Activity} onClick={() => setView('main')} />
                    <TabButton active={view === 'country'} label="Country Mapping" icon={Globe} onClick={() => setView('country')} />
                    <TabButton active={view === 'round-robin'} label="Round Robin" icon={ArrowRightLeft} onClick={() => setView('round-robin')} />
                    <TabButton active={view === 'load-based'} label="Load Based" icon={BarChart3} onClick={() => setView('load-based')} />
                </div>

                <div className="p-8 border-b border-[#E5E7EB] bg-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Identify specific distribution nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {view === 'main' && renderMainTable()}
                        {view === 'country' && renderCountryMapping()}
                        {view === 'round-robin' && renderRoundRobin()}
                        {view === 'load-based' && renderLoadBased()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Architect New Rule</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Defining lead distribution logic</p>
                                </div>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const data = Object.fromEntries(new FormData(e.target));
                                data.teamId = Number(data.teamId);
                                createRoutingRule.mutate(data, {
                                    onSuccess: () => setShowAddForm(false)
                                });
                            }} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Target Territory</label>
                                        <select name="country" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                            <option>UAE</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Operation Team</label>
                                        <select name="teamId" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Logic Pattern</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Country Based', value: 'COUNTRY_BASED' },
                                            { label: 'Round Robin', value: 'ROUND_ROBIN' },
                                            { label: 'Load Based', value: 'LOAD_BASED' }
                                        ].map(strategy => (
                                            <label key={strategy.value} className="relative cursor-pointer group">
                                                <input type="radio" name="strategy" value={strategy.value} defaultChecked={strategy.value === 'COUNTRY_BASED'} className="peer sr-only" />
                                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-center peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all group-hover:bg-white group-hover:shadow-sm">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest peer-checked:text-indigo-600 leading-none">{strategy.label}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Recipient Nodes (Counselors)</label>
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-wrap gap-2">
                                        {['Rahul K.', 'Susan V.', 'Ahmed K.'].map(tag => (
                                            <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[9px] font-black text-[#111827] uppercase tracking-widest">
                                                {tag}
                                                <Edit2 size={8} />
                                            </span>
                                        ))}
                                        <button type="button" className="p-2 bg-indigo-600 text-white rounded-lg hover:scale-110 transition-transform"><Plus size={10} /></button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Maximum Throughput (Load)</label>
                                    <input type="number" name="maxLoad" defaultValue={50} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Abort</button>
                                    <button type="submit" className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Deploy Rule</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default RoutingRules
