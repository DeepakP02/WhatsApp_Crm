import React, { useState, useEffect, useRef } from 'react'
import {
    Search, Filter, Send, Paperclip, MoreHorizontal, Phone, Video,
    ChevronRight, MessageSquare, CheckCircle2, Calendar, Clock, Loader,
    UserPlus, UserCheck, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCounselorActions, useChatActions, useSupportActions } from '../hooks/useCrmMutations'
import mockApi from '../lib/mockApi'
import useStore from '../store/useStore'

const Inbox = () => {
    const queryClient = useQueryClient()
    const { updateStage, addNote } = useCounselorActions()
    const { sendMessage, clearUnread } = useChatActions()
    const { assignLead, createLead } = useSupportActions()
    const { selectedLeadId, setSelectedLeadId, role } = useStore()

    const [messageInput, setMessageInput] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [newNoteInput, setNewNoteInput] = useState('')
    const [isAddingNote, setIsAddingNote] = useState(false)
    const scrollRef = useRef(null)

    // Modals for Support Role
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false)
    const [assignData, setAssignData] = useState({ team: 'Global Operations', counselor: 'Unassigned', priority: 'Medium' })
    const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', country: '', program: '', source: 'Social', assignTo: 'Auto', priority: 'Medium' })

    // Fetch Chats
    const { data: chats = [], isLoading: loadingChats } = useQuery({
        queryKey: ['chats'],
        queryFn: () => mockApi.counselor.getInbox().then(res => res.data)
    })

    const selectedChatId = selectedLeadId || (chats.length > 0 ? chats[0].id : null)

    useEffect(() => {
        if (!selectedLeadId && chats.length > 0) {
            setSelectedLeadId(chats[0].id)
        }
    }, [chats, selectedLeadId, setSelectedLeadId])

    const selectedChat = chats.find(c => c.id === selectedChatId)

    const { data: messages = [], isLoading: loadingMessages } = useQuery({
        queryKey: ['messages', selectedChatId],
        queryFn: () => [
            { id: 1, text: 'Hello, I saw your program details.', time: '10:00 AM', sender: 'lead' },
            { id: 2, text: 'Hi! How can I help you today?', time: '10:05 AM', sender: 'me' },
            { id: 3, text: 'I have a question about the program.', time: '10:30 AM', sender: 'lead' },
        ],
        enabled: !!selectedChatId
    })

    const { data: notesResp } = useQuery({
        queryKey: ['counselor-notes'],
        queryFn: () => mockApi.counselor.getLeadNotes()
    })

    const notes = Array.isArray(notesResp?.data) ? notesResp.data.filter(n => n.leadId === selectedChatId) : []

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = () => {
        if (!messageInput.trim()) return
        sendMessage.mutate({ chatId: selectedChatId, text: messageInput }, {
            onSuccess: () => {
                setMessageInput('')
                queryClient.setQueryData(['messages', selectedChatId], (old = []) => [
                    ...old,
                    { id: Date.now(), text: messageInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'me' }
                ])
            }
        })
    }

    const handleChatSelect = (id) => {
        setSelectedLeadId(id)
        if (chats.find(c => c.id === id)?.unread > 0) {
            clearUnread.mutate(id)
        }
    }

    const handleSaveNote = () => {
        if (!newNoteInput.trim()) return;
        addNote.mutate({ leadId: selectedChatId, text: newNoteInput }, {
            onSuccess: () => {
                setNewNoteInput('')
                setIsAddingNote(false)
            }
        })
    }

    const handleAssignLead = () => {
        assignLead.mutate({ leadId: selectedChatId, ...assignData }, {
            onSuccess: () => setIsAssignModalOpen(false)
        })
    }

    const handleCreateLead = () => {
        createLead.mutate({ ...newLeadData, sourceMessageId: selectedChatId }, {
            onSuccess: () => {
                setIsCreateLeadModalOpen(false)
                setNewLeadData({ name: '', phone: '', email: '', country: '', program: '', source: 'Social', assignTo: 'Auto', priority: 'Medium' })
            }
        })
    }

    const filteredChats = chats.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.program?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loadingChats) {
        return (
            <div className="h-[calc(100vh-160px)] flex items-center justify-center -m-6 bg-white">
                <div className="flex flex-col items-center gap-4 text-indigo-600">
                    <Loader className="animate-spin" size={32} />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Workspace...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-160px)] -m-6 bg-white flex overflow-hidden border-t border-[#E5E7EB]">
            {/* Left Panel */}
            <div className="w-80 border-r border-[#E5E7EB] flex flex-col bg-white shrink-0">
                <div className="p-4 border-b border-[#E5E7EB] space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#111827]">Messages</h2>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="h-4 w-4 text-[#6B7280]" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:border-transparent outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat.id)}
                            className={cn(
                                "p-4 border-b border-[#E5E7EB] cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 relative",
                                selectedChatId === chat.id && "bg-indigo-50 border-r-2 border-r-[#3B5BDB]"
                            )}
                        >
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold relative shrink-0">
                                {(chat.name || 'U').charAt(0)}
                                {chat.unread > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#EF4444] text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white font-black animate-bounce">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-xs font-bold text-[#111827] truncate uppercase tracking-tight">{chat.name}</h3>
                                    <span className="text-[9px] text-[#6B7280] font-bold">{chat.time}</span>
                                </div>
                                <p className="text-[11px] text-[#6B7280] truncate font-medium">{chat.lastMsg}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-[#6B7280] font-bold uppercase tracking-widest">{chat.channel}</span>
                                    <span className={cn(
                                        "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border",
                                        chat.status === 'Active' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                            chat.status === 'Converted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                    )}>{chat.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredChats.length === 0 && (
                        <div className="p-12 text-center text-gray-400 italic text-xs">No conversations found.</div>
                    )}
                </div>
            </div>

            {/* Center Panel */}
            <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
                {selectedChat ? (
                    <>
                        <div className="h-16 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm shadow-sm">
                                    {(selectedChat.name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[#111827] uppercase tracking-tight">{selectedChat.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest">Active Now</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Phone size={18} /></button>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Video size={18} /></button>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><MoreHorizontal size={18} /></button>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar scrolling-touch">
                            {loadingMessages ? (
                                <div className="h-full flex items-center justify-center opacity-50"><Loader size={24} className="animate-spin text-gray-400" /></div>
                            ) : (
                                <AnimatePresence initial={false} mode='popLayout'>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            layout
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn(
                                                "flex flex-col max-w-[80%]",
                                                msg.sender === 'me' ? "ml-auto items-end" : "items-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "px-4 py-2.5 rounded-2xl text-[13px] font-medium shadow-sm leading-relaxed",
                                                msg.sender === 'me'
                                                    ? "bg-[#111827] text-white rounded-tr-none"
                                                    : "bg-white text-[#111827] border border-[#E5E7EB] rounded-tl-none"
                                            )}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[9px] text-[#6B7280] font-bold mt-1.5 uppercase tracking-widest flex items-center gap-1">
                                                {msg.sender === 'me' && <CheckCircle2 size={10} className="text-indigo-500" />}
                                                {msg.time}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB]">
                            <div className="flex items-center gap-3 bg-gray-50 border border-[#E5E7EB] rounded-2xl pl-4 pr-2 py-2 focus-within:ring-2 focus-within:ring-[#3B5BDB] focus-within:border-transparent transition-all">
                                <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"><Paperclip size={18} /></button>
                                <input
                                    type="text"
                                    placeholder="Type a professional response..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium py-1.5 placeholder:text-gray-300"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!messageInput.trim() || sendMessage.isPending}
                                    className="bg-[#111827] text-white p-2.5 rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:shadow-none"
                                >
                                    <Send size={16} className={sendMessage.isPending ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                        <MessageSquare size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-400 uppercase tracking-widest font-black text-xs">Select a conversation</p>
                    </div>
                )}
            </div>

            {/* Right Panel */}
            {selectedChat && (
                <div className="w-85 border-l border-[#E5E7EB] bg-[#F9FAFB] overflow-y-auto no-scrollbar hidden xl:flex flex-col shrink-0">
                    <div className="p-8 border-b border-[#E5E7EB] text-center bg-white shadow-sm shrink-0">
                        <div className="h-24 w-24 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-3xl mx-auto mb-4 border-4 border-white shadow-xl">
                            {(selectedChat.name || 'U').charAt(0)}
                        </div>
                        <h3 className="text-lg font-black text-[#111827] uppercase tracking-tight">{selectedChat.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{selectedChat.country}</p>

                        {role !== 'Customer Support' && (
                            <div className="flex justify-center gap-2 mt-6">
                                <span className="text-[10px] px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold border border-indigo-100 uppercase tracking-tighter">Score: {selectedChat.score || '-'}</span>
                                <span className="text-[10px] px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-bold border border-emerald-100 uppercase tracking-tighter">
                                    {selectedChat.score > 80 ? '🔥 Hot Lead' : 'Warm Lead'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-8 flex-1 bg-white xl:bg-[#F9FAFB]">
                        {role === 'Customer Support' ? (
                            <section>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <UserCheck size={12} className="text-gray-300" /> Identity Information
                                </h4>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                    {[
                                        { label: 'Full Name', value: selectedChat.name },
                                        { label: 'Primary Phone', value: '+1 (555) 019-2834' },
                                        { label: 'Email Address', value: `${selectedChat.name.toLowerCase().replace(' ', '.')}@example.com` },
                                        { label: 'Geography', value: selectedChat.country },
                                        { label: 'Inbound Source', value: selectedChat.channel },
                                        { label: 'Current Status', value: selectedChat.status }
                                    ].map((item) => (
                                        <div key={item.label} className="group cursor-default">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
                                            <p className="text-xs font-black text-[#111827] group-hover:text-indigo-600 transition-colors">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <>
                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <MessageSquare size={12} className="text-gray-300" /> Lead Context
                                    </h4>
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        {[
                                            { label: 'Interested Program', value: selectedChat.program || 'Unknown' },
                                            { label: 'Channel Source', value: selectedChat.channel },
                                            { label: 'Unread Comm', value: `${selectedChat.unread} messages` }
                                        ].map((item) => (
                                            <div key={item.label} className="group cursor-default">
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
                                                <p className="text-xs font-black text-[#111827] group-hover:text-indigo-600 transition-colors">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock size={12} className="text-gray-300" /> Lifecycle Status
                                    </h4>
                                    <div className="relative group">
                                        <select
                                            value={selectedChat.status === 'Active' ? 'New' : selectedChat.status}
                                            onChange={(e) => updateStage.mutate({ leadId: selectedChatId, stage: e.target.value })}
                                            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black text-[#111827] appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer transition-all hover:border-indigo-200 uppercase tracking-tight"
                                        >
                                            <option>New</option>
                                            <option>Contacted</option>
                                            <option>Pending</option>
                                            <option>Qualified</option>
                                            <option>Converted</option>
                                            <option>Lost</option>
                                        </select>
                                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 size={12} className="text-gray-300" /> Counselor Notes
                                        </h4>
                                        <button onClick={() => setIsAddingNote(!isAddingNote)} title="Add short note" className="text-[10px] font-black text-[#3B5BDB] hover:underline uppercase">+ New</button>
                                    </div>

                                    <AnimatePresence>
                                        {isAddingNote && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mb-4 overflow-hidden"
                                            >
                                                <textarea
                                                    value={newNoteInput}
                                                    onChange={(e) => setNewNoteInput(e.target.value)}
                                                    placeholder="Write note..."
                                                    className="w-full text-xs p-3 border border-gray-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setIsAddingNote(false)} className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase tracking-widest hover:text-gray-600 transition-colors">Cancel</button>
                                                    <button
                                                        onClick={handleSaveNote}
                                                        disabled={addNote.isPending || !newNoteInput.trim()}
                                                        className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-lg shadow-sm hover:bg-indigo-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                    >
                                                        {addNote.isPending && <Loader size={10} className="animate-spin" />} Save
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-3">
                                        {notes.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No notes recorded yet.</p>
                                        ) : (
                                            notes.map((note) => (
                                                <div key={note.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{note.text}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1"><Calendar size={10} /> {note.date || 'Today'}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    <div className="mt-auto p-6 border-t border-[#E5E7EB] bg-white rounded-t-3xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] shrink-0">
                        {role === 'Customer Support' ? (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setIsAssignModalOpen(true)}
                                    className="w-full bg-[#111827] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-black hover:bg-black transition-all shadow-xl shadow-indigo-100/30 active:scale-[0.98] uppercase tracking-widest"
                                >
                                    <UserCheck size={16} /> Assign Lead
                                </button>
                                <button
                                    onClick={() => setIsCreateLeadModalOpen(true)}
                                    className="w-full bg-white border border-[#E5E7EB] text-[#111827] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-black hover:border-[#111827] transition-all shadow-sm active:scale-[0.98] uppercase tracking-widest"
                                >
                                    <UserPlus size={16} /> Create CRM Lead
                                </button>
                            </div>
                        ) : (
                            <button className="w-full bg-[#111827] text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]">
                                <Phone size={16} /> Schedule Call
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modals for Action Responses */}
            <AnimatePresence>
                {/* Assign Lead Modal */}
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest flex items-center gap-2"><UserCheck size={16} className="text-indigo-600" /> Delegate Control</h2>
                                <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-rose-500"><X size={16} /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Division</label>
                                    <select value={assignData.team} onChange={(e) => setAssignData({ ...assignData, team: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white text-[#111827]">
                                        <option>Global Operations</option>
                                        <option>Admissions South</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Counselor</label>
                                    <select value={assignData.counselor} onChange={(e) => setAssignData({ ...assignData, counselor: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white text-[#111827]">
                                        <option>John Doe (Available)</option>
                                        <option>Sarah Johnson (Busy)</option>
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button onClick={handleAssignLead} disabled={assignLead.isPending} className="w-full bg-[#111827] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50">
                                        Confirm Assignment {assignLead.isPending && <Loader size={12} className="animate-spin" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Create Lead Modal */}
                {isCreateLeadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCreateLeadModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest flex items-center gap-2"><UserPlus size={16} className="text-indigo-600" /> Synthesize CRM Profile</h2>
                                <button onClick={() => setIsCreateLeadModalOpen(false)} className="text-gray-400 hover:text-rose-500"><X size={16} /></button>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input type="text" value={newLeadData.name} onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold text-[#111827]" placeholder="e.g. John Smith" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Program</label>
                                    <input type="text" value={newLeadData.program} onChange={(e) => setNewLeadData({ ...newLeadData, program: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold text-[#111827]" placeholder="e.g. MBA" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                                    <input type="text" value={newLeadData.phone} onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold text-[#111827]" placeholder="+1 555-0000" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                                    <input type="email" value={newLeadData.email} onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold text-[#111827]" placeholder="john@email.com" />
                                </div>
                                <div className="col-span-2 pb-2">
                                    <button onClick={handleCreateLead} disabled={createLead.isPending || !newLeadData.name} className="w-full mt-4 bg-[#111827] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg flex justify-center items-center gap-2">
                                        Establish Identity {createLead.isPending && <Loader size={12} className="animate-spin" />}
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

export default Inbox
