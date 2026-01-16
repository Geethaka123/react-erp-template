import { useState, useMemo, useCallback } from 'react';

export function useSearchFilters<T>(
  data: T[] | undefined,
  filterFn: (item: T, searchValues: Record<string, string>, statusFilter: string) => boolean
) {
  const [statusFilter, setStatusFilter] = useState('View all');
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => filterFn(item, searchValues, statusFilter));
  }, [data, searchValues, statusFilter, filterFn]);

  const handleSearch = useCallback((values: Record<string, string>) => {
    setSearchValues(values);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status);
  }, []);

  const resetFilters = useCallback(() => {
    setStatusFilter('View all');
    setSearchValues({});
  }, []);

  return {
    filteredData,
    searchValues,
    statusFilter,
    handleSearch,
    handleStatusChange,
    resetFilters,
    setSearchValues,
    setStatusFilter
  };
}
