import { create } from 'zustand'

const useStore = create((set) => ({
    role: localStorage.getItem('role') || 'Super Admin',
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    country: 'All',
    dateRange: { from: null, to: null },
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    statusFilter: 'All',
    teamMember: 'All Users',
    searchTerm: '',
    selectedLeadId: null,
    counselorId: 'C-001', // Mock ID for queries

    setRole: (role) => {
        localStorage.setItem('role', role);
        set({ role });
    },
    login: (role, userData) => {
        const user = userData || { name: 'Demo User', email: `${role.toLowerCase().replace(' ', '.')}@crm.com` };
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(user));
        set({
            role,
            isAuthenticated: true,
            user
        });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        set({ isAuthenticated: false, user: null });
    },
    setCountry: (country) => set({ country }),
    setDateRange: (range) => set({ dateRange: range }),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    setTeamMember: (member) => set({ teamMember: member }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSelectedLeadId: (id) => set({ selectedLeadId: id }),
}))

export default useStore
