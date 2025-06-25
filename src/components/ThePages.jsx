import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ThePages({
  currentPage,
  setCurrentPage,
  paginationRange,
  totalPages,
}) {
  return (
    <>
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50">
        <FaChevronLeft size={14} />
      </button>
      {paginationRange.map((page, index) =>
        page === "..." ? (
          <span
            key={index}
            className="px-4 py-2 rounded-md text-sm font-semibold">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}>
            {page}
          </button>
        )
      )}
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50">
        <FaChevronRight size={14} />
      </button>
    </>
  );
}

export default ThePages;
