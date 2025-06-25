const usePaginationRange = (currentPage, totalPages) => {
  const pagination1 = [
    1,
    "...",
    totalPages - 3,
    totalPages - 2,
    totalPages - 1,
    totalPages,
  ];

  const pagination2 = [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];

  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
  if (currentPage > totalPages - 3) return pagination1;
  return pagination2;
};

export default usePaginationRange;
