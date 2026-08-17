import { useBackendData } from './useBackendData';

/**
 * Hook for fetching admin companies from API
 * Replaces hardcoded INITIAL_ENTERPRISES mockdata
 */

export interface CompanyData {
  id: string;
  name: string;
  field: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  capacity: number;
  status: string;
}

interface UseAdminCompaniesState {
  companies: CompanyData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAdminCompanies = (): UseAdminCompaniesState => {
  // Fetch companies from backend
  const { data: companies = [], loading, error, refetch } = useBackendData<CompanyData[]>(
    '/Admin/companies'
  );

  return { companies, loading, error, refetch };
};
