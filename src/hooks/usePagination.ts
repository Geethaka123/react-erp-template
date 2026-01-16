import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  itemsPerPage: number;
  initialPage?: number;
}

export function usePagination<T>(data: T[] | undefined, options: UsePaginationOptions) {
  const { itemsPerPage, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.ceil((data?.length || 0) / itemsPerPage) || 1;
  }, [data, itemsPerPage]);

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Reset page when data changes (e.g. after filtering)
  useMemo(() => {
    if (currentPage > totalPages) {
        setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage
  };
}
