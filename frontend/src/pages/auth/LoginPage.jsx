import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    UserCircle,
    Building2,
    Globe,
    Users,
    Activity,
    Headphones,
    BrainCircuit,
    Zap,
    Loader2
} from 'lucide-react'
import { cn } from '../../lib/utils'
import useStore from '../../store/useStore'
import authService from '../../services/authService'
import { toast } from '../../components/ui/Toast'

const RoleButton = ({ role, icon: Icon, active, onClick, color }) => (
    <button
        onClick={onClick}
        className={cn(
            "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group overflow-hidden",
            active
                ? `${color} border-transparent shadow-xl scale-105`
                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white"
        )}
    >
        <div className={cn(
            "p-3 rounded-xl mb-3 transition-colors",
            active ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
        )}>
            <Icon size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
            {role}
        </span>
        {active && (
            <motion.div
                layoutId="role-glow"
                className="absolute inset-0 bg-white/10 pointer-events-none"
            />
        )}
    </button>
)

const LoginPage = () => {
    const { login } = useStore()
    const navigate = useNavigate()
    const [selectedRole, setSelectedRole] = useState('Super Admin')
    const [email, setEmail] = useState('superadmin@crm.com')
    const [password, setPassword] = useState('password123')
    const [isLoading, setIsLoading] = useState(false)

    const roles = [
        { id: 'Super Admin', icon: ShieldCheck, color: 'bg-indigo-600', email: 'superadmin@crm.com' },
        { id: 'Admin', icon: Building2, color: 'bg-violet-600', email: 'admin@crm.com' },
        { id: 'Manager', icon: Globe, color: 'bg-emerald-600', email: 'manager@crm.com' },
        { id: 'Team Leader', icon: BrainCircuit, color: 'bg-blue-600', email: 'tl@crm.com' },
        { id: 'Counselor', icon: Users, color: 'bg-amber-600', email: 'counselor1@crm.com' },
        { id: 'Customer Support', icon: Headphones, color: 'bg-rose-600', email: 'support@crm.com' },
    ]

    const handleRoleSelect = (role) => {
        setSelectedRole(role.id)
        setEmail(role.email)
        setPassword('password123') // Uniform demo password
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await authService.login(email, password)
            if (response.success) {
                // If backend provides role in user object, use it. 
                // Otherwise fall back to the selectedRole from the UI selector for demo purposes
                const userRole = response.data.user?.role || selectedRole
                login(userRole, response.data.user)

                const roleRoutes = {
                    'SUPER_ADMIN': '/super-admin',
                    'ADMIN': '/admin',
                    'MANAGER': '/manager',
                    'TEAM_LEADER': '/team-leader',
                    'COUNSELOR': '/counselor',
                    'CUSTOMER_SUPPORT': '/support',
                    'SUPPORT': '/support',
                    // Fallbacks for UI selection
                    'Super Admin': '/super-admin',
                    'Admin': '/admin',
                    'Manager': '/manager',
                    'Team Leader': '/team-leader',
                    'Counselor': '/counselor',
                    'Customer Support': '/support'
                }

                toast.success('Access Initialized Successfully')
                navigate(roleRoutes[userRole] || '/')
            } else {
                toast.error(response.error || 'Identity Verification Failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error(error.response?.data?.error || 'Communication Protocol Error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Branding & Info */}
                <div className="hidden lg:block space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <Zap className="text-white" size={28} strokeWidth={2.5} />
                            </div>
                            <span className="text-3xl font-black text-white uppercase tracking-tighter">WHATSAPP CRM</span>
                        </div>
                        <h1 className="text-6xl font-black text-white leading-tight uppercase tracking-tight">
                            Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Gateway</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                            Access the global multi-channel communication cluster. Integrated intelligence for modern lead orchestration.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { label: 'Real-time Sync', sub: '99.9% Uptime', icon: Activity },
                            { label: 'AI Qualified', sub: 'ML Protocol', icon: BrainCircuit },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                                <stat.icon className="text-indigo-400 mb-4" size={24} />
                                <div className="text-sm font-black text-white uppercase tracking-widest">{stat.label}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10"
                >
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Establish Session</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select an administrative identity to initialize access</p>
                    </div>

                    {/* Role Selector Grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {roles.map(role => (
                            <RoleButton
                                key={role.id}
                                role={role.id}
                                icon={role.icon}
                                color={role.color}
                                active={selectedRole === role.id}
                                onClick={() => handleRoleSelect(role)}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Access Credentials</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-sm font-black text-white uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all"
                                        placeholder="IDENTITY ADDRESS"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-sm font-black text-white tracking-[0.5em] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Initialize Access</span>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                            Secure Multi-Channel Authentication Protocol v4.2
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginPage
