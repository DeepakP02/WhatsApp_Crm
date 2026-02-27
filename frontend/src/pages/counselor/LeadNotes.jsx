import React, { useState } from 'react'
import { FileEdit, Search, Filter, Calendar, Trash2, Edit2, Loader, RefreshCcw, UserCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useCounselorActions } from '../../hooks/useCrmMutations'
import counselorApi from '../../api/counselor.api.js'

const LeadNotes = () => {
    const { updateNote, deleteNote } = useCounselorActions()
    const [searchTerm, setSearchTerm] = useState('')
    const [editingNote, setEditingNote] = useState(null)
    const [noteText, setNoteText] = useState('')

    const { data: notesResp, isLoading, refetch } = useQuery({
        queryKey: ['counselor-notes'],
        queryFn: () => counselorApi.fetchAllNotes()
    })

    // Support the wrapper structure returned by execute
    const notesData = (Array.isArray(notesResp?.data) ? notesResp.data : []).map(n => ({
        id: n.id,
        leadName: n.lead?.name || 'Unknown Lead',
        text: n.content,
        date: new Date(n.createdAt).toLocaleDateString(),
        createdBy: n.author?.name || 'Counselor'
    }))

    const filteredNotes = notesData.filter(n =>
        n.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.text.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEditNote = (note) => {
        setEditingNote(note.id)
        setNoteText(note.text)
    }

    const handleSaveNote = () => {
        if (!noteText.trim()) return;
        updateNote.mutate({ id: editingNote, text: noteText }, {
            onSuccess: () => {
                setEditingNote(null);
                setNoteText('');
            }
        });
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Lead Notes</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Review operational, qualitative intel collected during lead engagements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border text-gray-600 border-gray-200 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2">
                        <Filter size={14} /> Filter Notes
                    </button>
                    <button className="bg-[#111827] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                        <FileEdit size={14} /> Global Note Entry
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-[#111827] uppercase tracking-widest text-xs">Note Directory</h3>
                        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                            {notesData.length} Total Notes
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:w-80">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by lead name or note keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button onClick={() => refetch()} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-indigo-600 shadow-sm">
                            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center text-indigo-600 opacity-50">
                                <Loader className="animate-spin mb-4" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Loading notes database...</p>
                            </div>
                        ) : filteredNotes.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 opacity-50">
                                <FileEdit size={48} className="mb-4" />
                                <p className="text-[11px] font-black uppercase tracking-widest">No notes matching criteria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {filteredNotes.map((note) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={note.id}
                                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group relative"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                                                        {note.leadName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-[#111827] uppercase tracking-tight">{note.leadName}</h4>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                            <Calendar size={10} /> {note.date || 'Today'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 transition-opacity">
                                                    <button onClick={() => handleEditNote(note)} className="p-1.5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-md transition-colors">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => deleteNote.mutate(note.id)} className="p-1.5 text-gray-400 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-md transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed line-clamp-4">
                                                {note.text}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                                <UserCircle2 size={14} className="text-gray-400" />
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    By {note.createdBy || 'Counselor Profile'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Note Modal */}
            <AnimatePresence>
                {editingNote && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setEditingNote(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight">Modify Note</h2>
                            </div>
                            <div className="p-6">
                                <textarea
                                    className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-sm"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                />
                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        onClick={() => setEditingNote(null)}
                                        className="px-5 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={updateNote.isPending || !noteText.trim()}
                                        className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updateNote.isPending ? <RefreshCcw size={14} className="animate-spin" /> : 'Update Note'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LeadNotes
