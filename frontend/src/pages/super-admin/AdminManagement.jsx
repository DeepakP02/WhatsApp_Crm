import React, { useState } from 'react'
import { User, Shield, Search, Filter, MoreVertical, Edit, Key, ShieldOff, Database, UserPlus, X, ShieldCheck, Mail, Globe, Lock } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSuperAdminGovernance } from '../../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'

const AdminModal = ({ isOpen, onClose, admin = null }) => {
    const { addAdmin, updatePermissions } = useSuperAdminGovernance();
    const [formData, setFormData] = useState(admin ? { ...admin } : {
        name: '',
        email: '',
        client: 'EduCorp Inc.',
        role: 'Regional Admin',
        permissions: ['Users', 'Analytics'],
    });

    if (!isOpen) return null;

    const togglePermission = (perm) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter(p => p !== perm)
                : [...prev.permissions, perm]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (admin) {
            updatePermissions.mutate({ id: admin.id, permissions: formData.permissions }, { onSuccess: onClose });
        } else {
            addAdmin.mutate(formData, { onSuccess: onClose });
        }
    };

    const isPending = addAdmin.isPending || updatePermissions.isPending;
    const permissionOptions = ['Billing', 'Channels', 'Users', 'Analytics'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#3B5BDB] text-white rounded-2xl shadow-lg shadow-indigo-100">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">{admin ? 'Edit Permissions' : 'Add Admin'}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Tier-1 Access Protocol v4.0</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={20} className="text-gray-400" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-5">
                        {!admin && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <User size={12} /> Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Admin Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <Mail size={12} /> Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="admin@client.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <Database size={12} /> Client Entity
                                    </label>
                                    <select
                                        value={formData.client}
                                        onChange={e => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option>EduCorp Inc.</option>
                                        <option>HealthLine</option>
                                        <option>Global Connect</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <ShieldCheck size={12} /> Admin Role
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option>System Admin</option>
                                        <option>Regional Admin</option>
                                        <option>Support Admin</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Lock size={12} /> Access Permissions
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {permissionOptions.map(perm => (
                                    <button
                                        key={perm}
                                        type="button"
                                        onClick={() => togglePermission(perm)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest",
                                            formData.permissions.includes(perm)
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-md flex items-center justify-center border",
                                            formData.permissions.includes(perm) ? "bg-white border-white text-indigo-600" : "bg-white border-gray-200"
                                        )}>
                                            {formData.permissions.includes(perm) && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                                        </div>
                                        {perm}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            disabled={isPending}
                            type="submit"
                            className="flex-1 py-4 bg-[#111827] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                        >
                            {isPending ? 'Syncing...' : admin ? 'Save Updates' : 'Provision Admin'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const AdminManagement = () => {
    const { toggleStatus } = useSuperAdminGovernance();
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState(null)

    const { data: admins = [], isLoading } = useQuery({
        queryKey: ['admins'],
        queryFn: () => [
            { id: 1, name: 'Sarah Connor', email: 'sarah.c@educorp.com', client: 'EduCorp Inc.', role: 'System Admin', permissions: ['Billing', 'Channels', 'Users', 'Analytics'], status: 'Active', login: '10 mins ago' },
            { id: 2, name: 'Marcus Wright', email: 'marcus@healthline.io', client: 'HealthLine', role: 'Support Admin', permissions: ['Channels', 'Users'], status: 'Active', login: '1 hour ago' },
            { id: 3, name: 'John Wick', email: 'john.w@global.connect', client: 'Global Connect', role: 'Regional Admin', permissions: ['Billing', 'Analytics'], status: 'Inactive', login: '2 days ago' },
            { id: 4, name: 'Kyle Reese', email: 'kyle@educorp.com', client: 'EduCorp Inc.', role: 'System Admin', permissions: ['Users'], status: 'Active', login: 'Yesterday' },
        ]
    })

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.client.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const openEditModal = (admin) => {
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setSelectedAdmin(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Administrative Governance</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Protocol-level control over client-tier administrative accounts and authority scopes.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-[#111827] text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <UserPlus size={18} /> Add Admin
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between gap-6">
                    <div className="relative max-w-sm w-full">
                        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Identify by name or client domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none w-full transition-all shadow-sm"
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-3 px-6 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={14} /> Total Admins: {filteredAdmins.length}
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#F9FAFB]/50">
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Name</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Role</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Permissions</th>
                                <th className="px-10 py-6 font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Last Active</th>
                                <th className="px-10 py-6 text-right font-black text-gray-400 uppercase text-[9px] tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]/50 text-xs">
                            <AnimatePresence mode='popLayout'>
                                {filteredAdmins.map((admin) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={admin.id}
                                        className="group hover:bg-gray-50/50 transition-all"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black transition-all shadow-sm border border-gray-200">
                                                    {(admin.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-sm text-[#111827] uppercase tracking-tighter">{admin.name}</div>
                                                    <div className="text-[10px] text-gray-400 flex items-center gap-2 font-black uppercase tracking-widest mt-1"><Mail size={12} className="text-gray-300" /> {admin.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-black text-xs text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 inline-block">
                                                {admin.role}
                                            </div>
                                            <div className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-widest flex items-center gap-2 px-1"><Globe size={10} className="text-gray-300" /> {admin.client}</div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-2 max-w-[200px]">
                                                {admin.permissions.map(perm => (
                                                    <span key={perm} className="px-2 py-1 bg-gray-100 rounded-lg text-gray-500 text-[9px] font-black uppercase tracking-widest border border-gray-200">
                                                        {perm}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full shadow-lg",
                                                        admin.status === 'Active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'
                                                    )} />
                                                    <span className="font-black text-gray-800 tracking-widest uppercase text-[10px]">{admin.status}</span>
                                                </div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-4">{admin.login}</div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(admin)}
                                                    className="p-3 bg-white hover:bg-indigo-600 rounded-2xl border border-gray-100 text-gray-400 hover:text-white transition-all shadow-sm active:scale-90"
                                                    title="Edit Permissions"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const action = admin.status === 'Active' ? 'deactivate' : 'activate';
                                                        if (window.confirm(`Are you sure you want to ${action} ${admin.name}?`)) {
                                                            toggleStatus.mutate(admin.id)
                                                        }
                                                    }}
                                                    disabled={toggleStatus.isPending}
                                                    className={cn(
                                                        "p-3 rounded-2xl border transition-all shadow-sm active:scale-90 disabled:opacity-50",
                                                        admin.status === 'Active'
                                                            ? "bg-white hover:bg-rose-500 text-gray-400 hover:text-white border-gray-100"
                                                            : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                                                    )}
                                                    title={admin.status === 'Active' ? "Deactivate Account" : "Activate Account"}
                                                >
                                                    <Shield size={16} className={toggleStatus.isPending ? "animate-pulse" : ""} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between mt-auto">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Governance protocol active</p>
                    <div className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100">
                        <Lock size={12} /> Encrypted Access Management
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <AdminModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        admin={selectedAdmin}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminManagement
