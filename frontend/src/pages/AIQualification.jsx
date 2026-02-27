import React from 'react'
import {
    Plus,
    GripVertical,
    Trash2,
    Settings2,
    Save,
    BrainCircuit,
    Target,
    UserCheck
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

const QuestionItem = ({ question, index }) => (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex gap-4 items-start group hover:border-[#3B5BDB] transition-colors shadow-sm">
        <div className="mt-1 flex flex-col items-center gap-1 cursor-grab text-gray-300 group-hover:text-gray-400">
            <GripVertical size={20} />
        </div>
        <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#3B5BDB] uppercase tracking-wider">Step {index + 1}</span>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444] rounded hover:bg-rose-50 transition-colors"><Trash2 size={16} /></button>
                    <button className="p-1.5 text-[#6B7280] hover:text-[#3B5BDB] rounded hover:bg-indigo-50 transition-colors"><Settings2 size={16} /></button>
                </div>
            </div>
            <input
                type="text"
                defaultValue={question}
                className="w-full font-medium text-[#111827] bg-transparent border-none focus:ring-0 p-0"
            />
            <div className="flex gap-2">
                <span className="text-[10px] px-2 py-1 bg-gray-100 rounded text-[#111827] font-medium border border-gray-200">Text Input</span>
                <span className="text-[10px] px-2 py-1 bg-indigo-50 text-[#3B5BDB] rounded font-medium border border-indigo-100">Extracts: Program</span>
            </div>
        </div>
    </div>
)

const AIQualification = () => {
    const questions = [
        "What is your highest qualification?",
        "Which program are you interested in?",
        "When are you planning to start?",
        "Do you have a valid passport?"
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">AI Qualification Builder</h1>
                    <p className="text-[#6B7280]">Design the chat flow and extraction rules for automatic lead qualification.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm">
                        <Save className="h-4 w-4" />
                        <span>Save Flow</span>
                    </button>
                    <button className="flex items-center gap-2 bg-[#3B5BDB] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2B4BDB] transition-colors shadow-sm text-sm">
                        <Plus className="h-4 w-4" />
                        <span>Add Question</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Flow Builder */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                        <BrainCircuit size={18} className="text-[#3B5BDB]" />
                        Qualification Flow
                    </h3>
                    <div className="space-y-3">
                        {questions.map((q, i) => (
                            <QuestionItem key={i} question={q} index={i} />
                        ))}
                    </div>
                </div>

                {/* Right: Rules & Preview */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
                        <h3 className="text-sm font-bold text-[#111827] mb-4 flex items-center gap-2">
                            <Target size={18} className="text-[#3B5BDB]" />
                            Scoring Rules
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#6B7280]">Minimum Score</span>
                                <span className="text-sm font-bold text-[#111827]">65</span>
                            </div>
                            <input type="range" className="w-full accent-[#3B5BDB]" defaultValue="65" />
                            <div className="space-y-2 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="rounded text-[#3B5BDB] focus:ring-[#3B5BDB]" defaultChecked />
                                    <span className="text-sm text-[#111827]">Auto-assign qualified leads</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="rounded text-[#3B5BDB] focus:ring-[#3B5BDB]" defaultChecked />
                                    <span className="text-sm text-[#111827]">Send WhatsApp notification</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827] p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <UserCheck size={18} className="text-[#10B981]" />
                                Extraction Preview
                            </h3>
                            <div className="space-y-2">
                                {['Name', 'Email', 'Program', 'Qualification', 'Timeline'].map((field) => (
                                    <div key={field} className="flex justify-between items-center text-xs border-b border-[#1F2937] py-2">
                                        <span className="text-gray-400">{field}</span>
                                        <span className="text-gray-200">Pending</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 opacity-10">
                            <BrainCircuit size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIQualification
