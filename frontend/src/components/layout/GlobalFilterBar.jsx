import React, { useState } from 'react'
import { Calendar, MapPin, Users, Tag, ChevronDown, Filter } from 'lucide-react'
import useStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { useQueryClient } from '@tanstack/react-query'

const FilterItem = ({ label, value, icon: Icon, options, onChange }) => (
    <div className="relative flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg cursor-pointer shadow-sm group">
        <Icon className="h-4 w-4 text-[#6B7280]" />
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider leading-none mb-0.5">{label}</span>
            <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#111827]">{value}</span>
                <ChevronDown size={12} className="text-[#6B7280]" />
            </div>
        </div>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        >
            {options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
)

const GlobalFilterBar = () => {
    const {
        country, setCountry,
        statusFilter, setStatusFilter,
        teamMember, setTeamMember,
        dateRange, setDateRange
    } = useStore()

    // Local state for filters before applying
    const [localCountry, setLocalCountry] = useState(country)
    const [localStatus, setLocalStatus] = useState(statusFilter)
    const [localTeamMember, setLocalTeamMember] = useState(teamMember || 'All Users')
    const [localDateRange, setLocalDateRange] = useState(dateRange?.label || 'Last 30 Days')

    const queryClient = useQueryClient()

    const handleApplyFilters = () => {
        setCountry(localCountry)
        setStatusFilter(localStatus)
        setTeamMember(localTeamMember)
        setDateRange({ label: localDateRange, from: null, to: null })

        // Invalidate queries to refetch based on new filters
        queryClient.invalidateQueries()
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
                <FilterItem
                    label="Date Range"
                    value={localDateRange}
                    icon={Calendar}
                    options={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'All Time']}
                    onChange={setLocalDateRange}
                />
                <FilterItem
                    label="Country"
                    value={localCountry}
                    icon={MapPin}
                    options={['All', 'India', 'USA', 'UK', 'UAE', 'Canada']}
                    onChange={setLocalCountry}
                />
                <FilterItem
                    label="Lead Status"
                    value={localStatus}
                    icon={Tag}
                    options={['All', 'Hot', 'Warm', 'Cold']}
                    onChange={setLocalStatus}
                />
                <FilterItem
                    label="Team Member"
                    value={localTeamMember}
                    icon={Users}
                    options={['All Users', 'John Doe', 'Sarah Johnson', 'Rahul K.']}
                    onChange={setLocalTeamMember}
                />
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end">
                <button className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] px-3 py-2 font-medium text-sm transition-colors">
                    <Filter size={16} />
                    <span>More Filters</span>
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="bg-[#111827] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-colors shadow-sm active:scale-95"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    )
}

export default GlobalFilterBar
