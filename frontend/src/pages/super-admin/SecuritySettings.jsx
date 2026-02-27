import React, { useState, useEffect } from 'react'
import { Shield, Lock, Key, Smartphone, Globe, Eye, Save, RotateCcw, ShieldAlert, History, UserCheck, Server, Monitor, MapPin, Hash, LogOut, Loader2, ShieldCheck, Timer } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSecurityActions } from '../../hooks/useCrmMutations'
import mockApi from '../../lib/mockApi'
import { motion, AnimatePresence } from 'framer-motion'

const SecurityCard = ({ title, description, icon: Icon, children }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#111827]">
                    <Icon size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-[#111827] uppercase tracking-tight">{title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{description}</p>
                </div>
            </div>
        </div>
        <div className="p-8 space-y-6">
            {children}
        </div>
    </motion.div>
)

const Toggle = ({ enabled, onChange, label, sublabel }) => (
    <div className="flex items-center justify-between group">
        <div>
            <div className="text-xs font-black text-[#111827] uppercase tracking-wide">{label}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{sublabel}</div>
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-inner",
                enabled ? "bg-indigo-600" : "bg-gray-200"
            )}
        >
            <span className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-md",
                enabled ? "translate-x-8" : "translate-x-1"
            )} />
        </button>
    </div>
)

const SecuritySettings = () => {
    const { updateSettings, logoutSession } = useSecurityActions()

    const { data: settingsData, isLoading: settingsLoading } = useQuery({
        queryKey: ['security-settings'],
        queryFn: () => mockApi.security.getSettings().then(res => res.data)
    })

    const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
        queryKey: ['active-sessions'],
        queryFn: () => mockApi.security.getActiveSessions().then(res => res.data)
    })

    const [localSettings, setLocalSettings] = useState(null)
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    })

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordForm.new !== passwordForm.confirm) {
            alert("Sequences do not match.");
            return;
        }
        alert("Personal sequence rotation initiated.");
        setPasswordForm({ current: '', new: '', confirm: '' });
    }

    useEffect(() => {
        if (settingsData) setLocalSettings(settingsData)
    }, [settingsData])

    if (settingsLoading || !localSettings) return (
        <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <div className="font-black text-gray-300 uppercase tracking-[0.3em] text-xs">Calibrating Encryption Matrix...</div>
        </div>
    )

    const handleSave = () => {
        updateSettings.mutate(localSettings)
    }

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Security & Governance</h1>
                    <p className="text-sm font-medium text-[#6B7280]">Real-time protocol enforcement and identity integrity management.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setLocalSettings(settingsData)}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-500 active:scale-95 transition-all shadow-sm"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={updateSettings.isPending}
                        className="bg-[#111827] text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        <Save size={18} /> {updateSettings.isPending ? 'Syncing...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <SecurityCard
                    title="Login Security"
                    description="Access verification and session integrity"
                    icon={ShieldCheck}
                >
                    <Toggle
                        label="Force 2FA"
                        sublabel="Mandatory multi-factor authentication for all administrators"
                        enabled={localSettings.force2FA}
                        onChange={(val) => setLocalSettings({ ...localSettings, force2FA: val })}
                    />
                    <div className="h-[1px] bg-gray-50" />
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <History size={12} /> Session Timeout
                        </label>
                        <select
                            value={localSettings.sessionTimeout}
                            onChange={(e) => setLocalSettings({ ...localSettings, sessionTimeout: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>15 mins</option>
                            <option>30 mins</option>
                            <option>60 mins</option>
                            <option>4 hours</option>
                        </select>
                    </div>
                </SecurityCard>

                <SecurityCard
                    title="Change Protocol Array"
                    description="Rotate your personal encryption sequence"
                    icon={Key}
                >
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Lock size={12} /> Current Sequence
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordForm.current}
                                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300 tracking-[0.3em]"
                                placeholder={"••••••••"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Key size={12} /> New Sequence
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordForm.new}
                                onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300 tracking-[0.3em]"
                                placeholder={"••••••••"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={12} /> Verify Sequence
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordForm.confirm}
                                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-300 tracking-[0.3em]"
                                placeholder={"••••••••"}
                            />
                        </div>
                        <button type="submit" className="w-full py-4 mt-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100">
                            Apply New Sequence
                        </button>
                    </form>
                </SecurityCard>

                <div className="xl:col-span-2">
                    <SecurityCard
                        title="Active Sessions"
                        description="Real-time telemetry of authorized system connections"
                        icon={Monitor}
                    >
                        <div className="overflow-x-auto -mx-8">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Identity</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hardware/Soft</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Geolocation/IP</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Vector</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <AnimatePresence mode='popLayout'>
                                        {sessions.map((session) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                key={session.id}
                                                className="group hover:bg-gray-50/50 transition-all"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 shadow-sm">
                                                            {session.user.charAt(0)}
                                                        </div>
                                                        <div className="font-bold text-xs text-[#111827] uppercase tracking-tight">{session.user}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Monitor size={12} className="text-gray-300" /> {session.device}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                                            <MapPin size={12} className="text-rose-400" /> {session.location}
                                                        </div>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-5">{session.ip}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em] flex items-center gap-2">
                                                        <History size={12} /> {session.loginTime}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => logoutSession.mutate(session.id)}
                                                        disabled={logoutSession.isPending}
                                                        className="p-3 bg-white hover:bg-rose-500 rounded-2xl border border-gray-100 text-gray-400 hover:text-white transition-all shadow-sm active:scale-90 disabled:opacity-50"
                                                        title="Revoke Session"
                                                    >
                                                        <LogOut size={16} className={logoutSession.isPending ? "animate-pulse" : ""} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </SecurityCard>
                </div>
            </div>
        </div>
    )
}

export default SecuritySettings
