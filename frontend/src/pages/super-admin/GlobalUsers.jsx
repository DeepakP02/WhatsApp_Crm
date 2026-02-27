import React, { useState } from 'react'
import { Users, Mail, UserCheck, Search, Filter, MoreVertical, Edit, Key, ShieldOff, Globe, Database, Plus, ChevronDown, X, Shield, MapPin, Briefcase } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useUserActions } from '../../hooks/useCrmMutations'
import * as superAdminApi from '../../api/superAdmin.api.js'
import { motion, AnimatePresence } from 'framer-motion'

const UserModal = ({ isOpen, onClose, user = null }) => {
    const { addUser, updateUser } = useUserActions();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Counselor',
        client: user?.client || 'EduCorp Inc.',
        country: user?.country || 'India',
        team: user?.team?.name || 'Admissions'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user) {
            updateUser.mutate({ id: user.id, ...formData }, { onSuccess: onClose });
        } else {
            addUser.mutate(formData, { onSuccess: onClose });
        }
    };

    const isPending = addUser.isPending || updateUser.isPending;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#111827] text-white rounded-2xl shadow-lg shadow-gray-200">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">{user ? 'Refine Identity' : 'Provision User'}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global Directory Protocol v2.4</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={20} className="text-gray-400" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-1 sm:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <UserCheck size={12} /> Full Name
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                                placeholder="e.g. Alexander Pierce"
                            />
                        </div>
                        <div className="space-y-1 col-span-1 sm:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                                placeholder="alex@nexus.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <Shield size={12} /> Global Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="COUNSELOR">Counselor</option>
                                <option value="TEAM_LEADER">Team Leader</option>
                                <option value="CUSTOMER_SUPPORT">Support</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <Database size={12} /> Primary Client
                            </label>
                            <select
                                value={formData.client}
                                onChange={e => setFormData({ ...formData, client: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option>EduCorp Inc.</option>
                                <option>HealthLine</option>
                                <option>Global Connect</option>
                                <option>Platform Staff</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <MapPin size={12} /> Operational Country
                            </label>
                            <select
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option>India</option>
                                <option>USA</option>
                                <option>UK</option>
                                <option>Italy</option>
                                <option>Global</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                <Briefcase size={12} /> Department / Team
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.team}
                                onChange={e => setFormData({ ...formData, team: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                                placeholder="Operations"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            type="submit"
                            className="flex-1 py-4 bg-[#111827] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                        >
                            {isPending ? 'Deploying...' : user ? 'Sync Identity' : 'Authorize User'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const GlobalUsers = () => {
    const { toggleStatus, resetPassword } = useUserActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('All Roles')
    const [countryFilter, setCountryFilter] = useState('All Countries')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    // Real data fetching
    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ['globalUsers'],
        queryFn: superAdminApi.fetchGlobalUsers
    })

    const users = userData?.users || []

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
        const matchesCountry = countryFilter === 'All Countries' || user.country === countryFilter
        return matchesSearch && matchesRole && matchesCountry
    })

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Identity Registry</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Decentralized management of global credentials across all territorial zones.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-[#111827] text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <Plus size={18} /> Provision New Identity
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 border-b border-[#E5E7EB] bg-gray-50/50 flex flex-wrap gap-6 items-center">
                    <div className="relative flex-1 min-w-[320px]">
                        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Identify by name, hash, or client pool..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none w-full transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-[10px] font-black text-gray-400 uppercase tracking-widest appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer min-w-[180px] shadow-sm"
                            >
                                <option>All Roles</option>
                                <option>Admin</option>
                                <option>Manager</option>
                                <option>Counselor</option>
                                <option>Team Leader</option>
                                <option>Support</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="px-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-[10px] font-black text-gray-400 uppercase tracking-widest appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer min-w-[180px] shadow-sm"
                            >
                                <option>All Countries</option>
                                <option>India</option>
                                <option>USA</option>
                                <option>UK</option>
                                <option>Italy</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Name</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Role</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Team</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Assigned Channels</th>
                                <th className="px-10 py-6 text-right font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50 text-xs">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-[1.2rem] flex items-center justify-center font-black text-xs shadow-sm border border-indigo-100 uppercase">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-black text-sm text-[#111827] uppercase tracking-tighter">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-2 font-black uppercase tracking-widest mt-1"><Mail size={12} className="text-gray-300" /> {user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-xs text-[#111827] uppercase tracking-tighter">{user.role}</span>
                                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    user.status === 'Active' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                                        user.status === 'Away' ? 'bg-amber-400 shadow-amber-400/50' : 'bg-rose-500 shadow-rose-500/50'
                                                )} />
                                                <span className="font-black text-gray-600 tracking-widest uppercase text-[9px]">{user.status}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="font-black text-xs text-[#111827] uppercase tracking-tighter">{user.country || 'Global'}</div>
                                        <div className="text-[10px] text-indigo-500 mt-1 flex items-center gap-2 font-black uppercase tracking-widest"><Briefcase size={12} className="text-indigo-300" /> {user.team ? user.team.name : 'Unassigned'} Pool</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl font-black text-xs shadow-sm">
                                            <Globe size={14} className="text-indigo-500" />
                                            {user.assignedChannels} Nodes
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                                                title="Modify Identity"
                                            >
                                                <Edit size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
                                                        toggleStatus.mutate({ id: user.id, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
                                                    }
                                                }}
                                                disabled={toggleStatus.isPending}
                                                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                                                title="Decommission User"
                                            >
                                                <ShieldOff size={16} strokeWidth={2.5} className={toggleStatus.isPending ? "animate-pulse" : ""} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-gray-400 italic">
                                        <div className="flex flex-col items-center gap-4">
                                            <Users size={48} className="text-gray-100" />
                                            <span className="text-xs font-black uppercase tracking-[0.3em]">No identities located in current subspace</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between mt-auto">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">System encrypted user registry</p>
                    <div className="px-5 py-2 bg-[#111827] text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <UserCheck size={12} /> {filteredUsers.length} Authorized Entities
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <UserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        user={selectedUser}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default GlobalUsers
