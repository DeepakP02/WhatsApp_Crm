import { create } from 'zustand'

const useToastStore = create((set) => ({
    toasts: [],
    addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9)
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }]
        }))
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id)
            }))
        }, 3000)
    },
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }))
    }
}))

export const toast = {
    success: (msg) => useToastStore.getState().addToast(msg, 'success'),
    error: (msg) => useToastStore.getState().addToast(msg, 'error'),
    info: (msg) => useToastStore.getState().addToast(msg, 'info'),
    warning: (msg) => useToastStore.getState().addToast(msg, 'warning'),
}

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export const ToastContainer = () => {
    const toasts = useToastStore((state) => state.toasts)
    const removeToast = useToastStore((state) => state.removeToast)

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={18} />,
        error: <XCircle className="text-rose-500" size={18} />,
        info: <Info className="text-blue-500" size={18} />,
        warning: <AlertTriangle className="text-amber-500" size={18} />,
    }

    const styles = {
        success: "border-emerald-100 bg-emerald-50",
        error: "border-rose-100 bg-rose-50",
        info: "border-blue-100 bg-blue-50",
        warning: "border-amber-100 bg-amber-50",
    }

    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 min-w-[300px]">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg bg-white ${styles[t.type]}`}
                    >
                        {icons[t.type]}
                        <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
