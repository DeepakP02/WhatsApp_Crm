import React, { useState } from 'react'
import { Plus, Mail, Shield, UserPlus, MoreVertical, Search, Filter, ShieldCheck, UserX, UserCheck, Key, Globe, Layout, Lock, X, Edit2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../api/admin.api.js'
import { useUserActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRole, setSelectedRole] = useState('All')
    const [showAddForm, setShowAddForm] = useState(false)
    const { toggleStatus, resetPassword, addUser, updateUser } = useUserActions()

    const { data: userData, isLoading } = useQuery({
        queryKey: ['adminUsers', selectedRole, searchQuery],
        queryFn: () => adminApi.fetchUsers({
            role: selectedRole === 'All' ? undefined : selectedRole.toUpperCase().replace(' ', '_'),
            search: searchQuery
        })
    })

    const users = userData?.users || []

    const roles = ['All', 'Manager', 'Team Leader', 'Counselor', 'Support']

    const filteredUsers = users; // Server side filtering preferred but keeping name for compatibility

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">User Management</h1>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Personnel orchestration and access hierarchy control.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-3 bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                    <UserPlus className="h-5 w-5" strokeWidth={3} />
                    <span>Provision User</span>
                </button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Scan identities by name, team, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-gray-300"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                                selectedRole === role
                                    ? "bg-[#111827] text-white border-[#111827] shadow-xl shadow-gray-200"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-indigo-100 hover:text-indigo-600 shadow-sm"
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Identity</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Operational Role</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Territory / Team</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px]">Access State</th>
                                <th className="px-8 py-5 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                                                {(user.name || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-[#111827] uppercase tracking-tight text-xs">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-0.5">
                                                    <Mail size={12} className="text-indigo-400" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-indigo-600" />
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Globe size={12} className="text-gray-300" />
                                                <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{user.country || 'Global'}</span>
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{user.team?.name || 'No Team'}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300')} />
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                                user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                            )}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-all">
                                            <button
                                                onClick={() => resetPassword.mutate(user.email)}
                                                className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-amber-600 transition-all shadow-sm active:scale-90"
                                                title="Reset Credentials"
                                            >
                                                <Key size={14} />
                                            </button>
                                            <button
                                                onClick={() => toggleStatus.mutate(user.id)}
                                                className={cn(
                                                    "p-2.5 bg-white border border-gray-100 rounded-xl transition-all shadow-sm active:scale-90",
                                                    user.status === 'ACTIVE' ? "text-rose-500 hover:border-rose-100" : "text-emerald-500 hover:border-emerald-100"
                                                )}
                                                title={user.status === 'ACTIVE' ? 'Deactivate Account' : 'Initialize Access'}
                                            >
                                                {user.status === 'ACTIVE' ? <UserX size={14} /> : <UserCheck size={14} />}
                                            </button>
                                            <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm active:scale-90">
                                                <Edit2 size={14} />
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
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Provision Identity</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configuring new organizational access</p>
                                </div>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); addUser.mutate(Object.fromEntries(new FormData(e.target))); setShowAddForm(false); }} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Full Legal Name</label>
                                        <input name="name" required placeholder="JASON BOURNE" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Corporate Email</label>
                                        <input name="email" type="email" required placeholder="J.BOURNE@POVA.IO" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Strategic Role</label>
                                        <select name="role" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            {roles.filter(r => r !== 'All').map(role => <option key={role}>{role}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Node Territory</label>
                                        <select name="country" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all">
                                            <option>India</option>
                                            <option>USA</option>
                                            <option>UK</option>
                                            <option>Global</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Operation Team</label>
                                        <input name="team" required placeholder="ADMISSIONS SOUTH" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Initial Password</label>
                                        <input name="password" type="password" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Abort</button>
                                    <button type="submit" className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Establish Access</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserManagement
