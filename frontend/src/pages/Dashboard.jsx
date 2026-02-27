import React from 'react'
import { Users, MessageSquare, CheckCircle, Clock, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const KPICard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB] relative overflow-hidden group"
    >
        <div className="relative z-10">
            <div className={`p-2 rounded-lg ${color} w-fit mb-4`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">{title}</p>
            <h3 className="text-2xl font-bold text-[#111827] mt-1">{value}</h3>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={64} />
        </div>
    </motion.div>
)

const Dashboard = () => {
    const kpis = [
        { title: 'Total Leads', value: '1,284', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
        { title: 'Active Chats', value: '56', icon: MessageSquare, color: 'bg-blue-50 text-blue-600' },
        { title: 'Converted Leads', value: '412', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Pending Follow-ups', value: '89', icon: Clock, color: 'bg-amber-50 text-amber-600' },
        { title: 'New Messages', value: '12', icon: MessageSquare, color: 'bg-rose-50 text-rose-600' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Dashboard Overview</h1>
                    <p className="text-[#6B7280]">Welcome back! Here's what's happening with your leads today.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#3B5BDB] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2B4BDB] transition-colors shadow-sm">
                    <Plus className="h-4 w-4" />
                    <span>Add New Lead</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {kpis.map((kpi, index) => (
                    <KPICard key={index} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E5E7EB] h-[400px] flex items-center justify-center text-[#6B7280]">
                    Activity Feed (Coming Soon)
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] h-[400px] flex items-center justify-center text-[#6B7280]">
                    Recent Tasks (Coming Soon)
                </div>
            </div>
        </div>
    )
}

export default Dashboard
