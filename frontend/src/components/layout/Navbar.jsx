import React, { useState } from 'react'
import { Search, Bell, User, MapPin, ChevronDown, Menu } from 'lucide-react'
import useStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { useQueryClient } from '@tanstack/react-query'

const Navbar = () => {
  const { country, role, sidebarCollapsed, setMobileMenuOpen, setSearchTerm } = useStore()
  const [searchInput, setSearchInput] = useState('')
  const queryClient = useQueryClient()

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput)
      // Refetch logic
      queryClient.invalidateQueries()
    }
  }

  const countries = ['All', 'India', 'USA', 'UK', 'UAE', 'Canada']

  return (
    <header
      className={cn(
        "h-16 border-b border-[#E5E7EB] bg-white flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 z-40 transition-all duration-300",
        "left-0 lg:left-64",
        sidebarCollapsed && "lg:left-20"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search leads, users, messages... (Press Enter)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-[#6B7280] rounded-full transition-colors relative" title="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-[#E5E7EB]">
          <div className="text-right hidden sm:block">
            <p className="text-xs md:text-sm font-semibold text-[#111827] block p-0">
              {role}
            </p>
            <p className="text-[10px] text-[#6B7280]">Active Session</p>
          </div>
          <div className="h-8 w-8 md:h-9 md:w-9 bg-[#3B5BDB] rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
