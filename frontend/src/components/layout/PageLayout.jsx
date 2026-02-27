import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import GlobalFilterBar from './GlobalFilterBar'
import useStore from '../../store/useStore'
import { cn } from '../../lib/utils'

const PageLayout = ({ children }) => {
    const sidebarCollapsed = useStore((state) => state.sidebarCollapsed)

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            <Sidebar />
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 min-w-0",
                    "lg:ml-64",
                    sidebarCollapsed && "lg:ml-20"
                )}
            >
                <Navbar />

                <div className={cn(
                    "fixed top-16 right-0 z-30 bg-[#F9FAFB] border-b border-[#E5E7EB] transition-all duration-300",
                    "left-0 lg:left-64",
                    sidebarCollapsed && "lg:left-20"
                )}>
                    <div className="max-w-7xl mx-auto px-4 lg:px-6">
                        <GlobalFilterBar />
                    </div>
                </div>

                <main className="p-4 lg:p-6 flex-1 mt-36 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PageLayout
