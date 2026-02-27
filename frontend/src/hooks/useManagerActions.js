import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as managerApi from '../api/manager.api.js'
import { useCrmMutation } from './useCrmMutations'

export const useManagerActions = () => {
    const queryClient = useQueryClient();

    // Queries
    const useDashboard = () => useQuery({
        queryKey: ['manager', 'dashboard'],
        queryFn: async () => {
            const [summary, funnel, country] = await Promise.all([
                managerApi.fetchManagerSummary(),
                managerApi.fetchManagerFunnel(),
                managerApi.fetchCountryPerformance()
            ]);

            return {
                data: {
                    kpis: [
                        { title: 'Leads Today', value: summary.leadsToday || 0, subText: '+0%', type: 'leads_today' },
                        { title: 'Qualified', value: summary.qualified || 0, subText: '+0%', type: 'qualified_today' },
                        { title: 'Converted', value: summary.converted || 0, subText: '+0%', type: 'converted_today' },
                        { title: 'Enrolled', value: summary.enrolled || 0, subText: '+0%', type: 'enrolled_today' },
                    ],
                    funnelSummary: funnel.map(f => ({
                        stage: f.stage,
                        total: f.count,
                        conversion: f.prevStagePct,
                        dropoff: '0%' // Backend still needs logic for this
                    })),
                    countryPerformance: country
                }
            };
        }
    });

    const useFunnel = () => useQuery({
        queryKey: ['manager', 'funnel'],
        queryFn: async () => {
            const data = await managerApi.fetchManagerFunnel();
            return { data };
        }
    });

    const useCountryAnalytics = () => useQuery({
        queryKey: ['manager', 'country'],
        queryFn: async () => {
            const data = await managerApi.fetchCountryPerformance();
            return { data };
        }
    });

    const useSlaMetrics = () => useQuery({
        queryKey: ['manager', 'sla'],
        queryFn: async () => {
            const data = await managerApi.fetchSlaMetrics();
            return { data };
        }
    });

    const useConversionTracking = () => useQuery({
        queryKey: ['manager', 'conversion'],
        queryFn: async () => {
            const data = await managerApi.fetchConversionStats();
            return { data };
        }
    });

    const useTeamOverview = () => useQuery({
        queryKey: ['manager', 'team'],
        queryFn: async () => {
            const data = await managerApi.fetchTeamPerformance();
            return { data };
        }
    });

    const useCallReports = () => useQuery({
        queryKey: ['manager', 'calls'],
        queryFn: async () => {
            const data = await managerApi.fetchCallReports();
            return { data };
        }
    });

    // Mutations
    const refreshData = (key) => useCrmMutation({
        mutationFn: async () => {
            // In a real app, this might involve a specific refresh endpoint or just re-fetching
            return queryClient.invalidateQueries(['manager', key]);
        },
        successMessage: `${key.charAt(0).toUpperCase() + key.slice(1)} data refetched`,
    });

    const exportCsv = (type) => useCrmMutation({
        mutationFn: () => managerApi.exportManagerReport(type),
        successMessage: `${type.toUpperCase()} report exported as CSV`,
    });

    return {
        useDashboard,
        useFunnel,
        useCountryAnalytics,
        useSlaMetrics,
        useConversionTracking,
        useTeamOverview,
        useCallReports,
        refreshData,
        exportCsv
    };
};
