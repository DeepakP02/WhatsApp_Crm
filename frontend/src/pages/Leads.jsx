import React, { useMemo, useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel
} from '@tanstack/react-table'
import {
    MoreVertical,
    Filter,
    Download,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Trash2,
    UserPlus,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useLeadActions } from '../hooks/useCrmMutations'
import { motion, AnimatePresence } from 'framer-motion'

const Leads = () => {
    const { updateStage, deleteLead } = useLeadActions()
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')

    // Mock data fetching
    const { data: leads = [], isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: () => [
            { id: 1, name: 'Alice Johnson', email: 'alice@example.com', country: 'USA', status: 'Active', source: 'WhatsApp', assignedTo: 'John Doe', createdAt: '2024-02-20' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', country: 'India', status: 'Pending', source: 'Facebook', assignedTo: 'Jane Smith', createdAt: '2024-02-19' },
            { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', country: 'UK', status: 'Converted', source: 'Website', assignedTo: 'John Doe', createdAt: '2024-02-18' },
            { id: 4, name: 'Diana Prince', email: 'diana@example.com', country: 'UAE', status: 'Active', source: 'WhatsApp', assignedTo: 'Jane Smith', createdAt: '2024-02-17' },
            { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', country: 'Canada', status: 'Lost', source: 'WhatsApp', assignedTo: 'John Doe', createdAt: '2024-02-16' },
            { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', country: 'USA', status: 'Active', source: 'Facebook', assignedTo: 'Jane Smith', createdAt: '2024-02-15' },
            { id: 7, name: 'George Miller', email: 'george@example.com', country: 'India', status: 'Pending', source: 'Website', assignedTo: 'John Doe', createdAt: '2024-02-14' },
            { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', country: 'UK', status: 'Converted', source: 'WhatsApp', assignedTo: 'Jane Smith', createdAt: '2024-02-13' },
        ]
    })

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-[#111827] transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Name
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] border border-indigo-100 shadow-sm">
                        {row.original.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="font-bold text-[#111827]">{row.original.name}</div>
                        <div className="text-[10px] text-[#6B7280] font-medium italic">{row.original.email}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'country',
            header: 'Country',
            cell: ({ getValue }) => <span className="font-medium text-gray-600">{getValue()}</span>
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const statuses = {
                    Active: 'bg-blue-50 text-blue-600 border-blue-100',
                    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
                    Converted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    Lost: 'bg-rose-50 text-rose-600 border-rose-100'
                }
                return (
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border", statuses[row.original.status])}>
                        {row.original.status}
                    </span>
                )
            }
        },
        {
            accessorKey: 'source',
            header: 'Source',
            cell: ({ getValue }) => (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{getValue()}</span>
            )
        },
        {
            accessorKey: 'assignedTo',
            header: 'Assigned To',
            cell: ({ getValue }) => <span className="font-bold text-[#111827]">{getValue()}</span>
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ getValue }) => <span className="text-[10px] text-gray-500 font-medium">{getValue()}</span>
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => updateStage.mutate({ id: row.original.id, stage: 'Converted' })}
                        disabled={updateStage.isPending}
                        className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-all"
                        title="Mark as Converted"
                    >
                        <CheckCircle2 size={14} />
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete lead ${row.original.name}?`)) {
                                deleteLead.mutate(row.original.id)
                            }
                        }}
                        disabled={deleteLead.isPending}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-all"
                        title="Delete Lead"
                    >
                        <Trash2 size={14} className={deleteLead.isPending ? "animate-pulse" : ""} />
                    </button>
                    <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-all" title="Assign Lead">
                        <UserPlus size={14} />
                    </button>
                </div>
            )
        }
    ], [])

    const table = useReactTable({
        data: leads,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Leads Management</h1>
                    <p className="text-[#6B7280]">Total {leads.length} leads found across all channels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm">
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center gap-2 bg-[#111827] text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition-colors shadow-lg shadow-indigo-100 text-sm">
                        <Plus className="h-4 w-4" />
                        <span>Add Lead</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden text-sm">
                <div className="p-4 lg:p-6 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <input
                            type="text"
                            placeholder="Filter leads by name, email, or country..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:border-transparent text-xs"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] font-bold text-xs uppercase tracking-widest">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Advanced Filters</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-[#F9FAFB]">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 border-b border-[#E5E7EB] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] text-xs">
                            <AnimatePresence mode='popLayout'>
                                {table.getRowModel().rows.map(row => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        key={row.id}
                                        className="group hover:bg-gray-50 transition-colors"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 italic">
                                        No leads found matching your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 lg:p-6 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">
                        Total {table.getFilteredRowModel().rows.length} Results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                            className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all text-[#6B7280] disabled:text-gray-300"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(table.getPageCount())].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => table.setPageIndex(i)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-xs font-bold transition-all border",
                                        table.getState().pagination.pageIndex === i
                                            ? "bg-[#111827] text-white border-[#111827]"
                                            : "bg-white text-gray-500 border-transparent hover:border-gray-200"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.nextPage()}
                            className="p-2 border border-[#E5E7EB] rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all text-[#6B7280] disabled:text-gray-300"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leads
