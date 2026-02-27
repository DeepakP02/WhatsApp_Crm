import React, { useState } from 'react'
import { Search, Plus, Trash2, Edit3, MessageSquareQuote, CheckSquare, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useTemplateActions } from '../hooks/useCrmMutations'
import mockApi from '../lib/mockApi'
import { toast } from '../components/ui/Toast'

const TemplatesLibrary = () => {
    const { addTemplate, deleteTemplate, updateTemplate } = useTemplateActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ name: '', channel: 'WhatsApp', text: '' })

    const { data: resp, isLoading, refetch } = useQuery({
        queryKey: ['support-templates', searchTerm],
        queryFn: () => adminApi.fetchTemplates({ search: searchTerm })
    })

    const templates = Array.isArray(resp?.data) ? resp.data : []

    const filteredTemplates = templates.filter(tpl =>
        (tpl.name && tpl.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tpl.preview && tpl.preview.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleCreateTemplate = () => {
        addTemplate.mutate({ ...formData, body: formData.text }, {
            onSuccess: () => {
                setIsModalOpen(false)
                setFormData({ name: '', channel: 'WhatsApp', text: '' })
                refetch()
            }
        })
    }

    const handleUseInChat = (tpl) => {
        toast.success(`Template "${tpl.name}" loaded into active chat`)
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                        <MessageSquareQuote className="text-indigo-600" /> Template Repository
                    </h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Manage unified quick replies for multi-channel support.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                >
                    <Plus size={16} /> Create New Template
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates by name or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FAFB]">
                                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Template Name</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Channel</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Message Preview</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Created By</th>
                                <th className="px-4 py-4 font-black text-gray-400 uppercase tracking-widest text-[9px]">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            <AnimatePresence>
                                {filteredTemplates.map((tpl) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={tpl.id}
                                        className="group hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-black text-[#111827] uppercase tracking-tight text-xs flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                                                {tpl.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border bg-gray-50 text-gray-600 border-gray-200">
                                                {tpl.channel || 'All'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-medium text-gray-600 truncate max-w-[250px] inline-block italic">
                                                "{tpl.preview || tpl.text}"
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-gray-500 text-[10px]">
                                            {tpl.createdBy || 'System'}
                                        </td>
                                        <td className="px-4 py-5 font-black text-[#111827] text-[10px]">
                                            {tpl.date || '-'}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex gap-2 justify-end transition-opacity">
                                                <button onClick={() => handleUseInChat(tpl)} className="px-3 py-1.5 bg-[#111827] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5">
                                                    Use in Chat
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm bg-white shrink-0">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button onClick={() => deleteTemplate.mutate(tpl.id, { onSuccess: () => refetch() })} className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm bg-white shrink-0">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredTemplates.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <MessageSquareQuote size={48} className="text-gray-400 mb-4" />
                                            <p className="text-gray-500 uppercase tracking-widest font-black text-xs">No Templates Available.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Template Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight flex items-center gap-2">
                                    <MessageSquareQuote size={18} className="text-indigo-600" /> New Quick Reply
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors rounded-xl bg-white border border-gray-200 shadow-sm">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Template Descriptor</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Initial Greeting"
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black text-[#111827] tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Channel</label>
                                        <select
                                            value={formData.channel}
                                            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none bg-white"
                                        >
                                            <option value="WhatsApp">WhatsApp Business</option>
                                            <option value="Facebook">Facebook Messenger</option>
                                            <option value="Website">Website Widget</option>
                                            <option value="All">All Channels</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Message Payload</label>
                                        <textarea
                                            value={formData.text}
                                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                            placeholder="Write the automated response here..."
                                            rows={4}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleCreateTemplate}
                                        disabled={addTemplate.isPending || !formData.name || !formData.text}
                                        className="px-5 py-2.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Commit Template
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TemplatesLibrary
