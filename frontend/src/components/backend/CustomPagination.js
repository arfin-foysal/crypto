"use client";

import React from "react";

const CustomPagination = ({ pagination, onPageChange }) => {
  // If no pagination data, show a default pagination with one page
  if (!pagination) {
    pagination = {
      current_page: 1,
      last_page: 1,
      from: 1,
      to: 10,
      total: 10,
      per_page: 10,
    };
  }

  const { current_page, last_page, from, to, total, per_page } = pagination;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // If we have 5 or fewer pages, show all of them
    if (last_page <= maxPagesToShow) {
      for (let i = 1; i <= last_page; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, current_page - 1);
      let endPage = Math.min(last_page - 1, current_page + 1);

      // Adjust if we're near the beginning
      if (current_page <= 3) {
        endPage = Math.min(last_page - 1, 4);
      }

      // Adjust if we're near the end
      if (current_page >= last_page - 2) {
        startPage = Math.max(2, last_page - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < last_page - 1) {
        pageNumbers.push("...");
      }

      // Always include last page if it's not already included
      if (last_page > 1) {
        pageNumbers.push(last_page);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      {/* Pagination info */}
      <div className="text-sm text-[#BCBCBC]">
        {total > 0 ? (
          <>
            Showing <span className="font-medium text-white">{from}</span> to{" "}
            <span className="font-medium text-white">{to}</span> of{" "}
            <span className="font-medium text-white">{total}</span> results
          </>
        ) : (
          <span>No results found</span>
        )}
      </div>

      <nav aria-label="Pagination" className="flex-shrink-0">
        <ul className="flex items-center justify-center space-x-1 h-10 text-base">
          {/* First page button */}
          <li>
            <button
              onClick={() => onPageChange(1)}
              disabled={current_page === 1}
              className={`flex items-center justify-center px-3 h-10 ms-0 leading-tight text-[#95DA66] cursor-pointer border border-[#BCBCBC] rounded-md ${
                current_page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="First page"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </li>

          {/* Previous page button */}
          <li>
            <button
              onClick={() => onPageChange(current_page - 1)}
              disabled={current_page === 1}
              className={`flex items-center justify-center px-3 h-10 ms-0 leading-tight text-[#95DA66] cursor-pointer border border-[#BCBCBC] rounded-md ${
                current_page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Previous page"
            >
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </button>
          </li>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <li key={`page-${index}`}>
              {page === "..." ? (
                <span className="flex items-center justify-center px-4 h-10 leading-tight text-[#BCBCBC]">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`flex items-center cursor-pointer justify-center w-10 h-10 leading-tight ${
                    current_page === page
                      ? "bg-[#648A3A] border border-[#648A3A] text-white"
                      : "border border-[#959595] text-[#BCBCBC] hover:bg-[#2A2A2A]"
                  } rounded-md transition-colors duration-200`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Next page button */}
          <li>
            <button
              onClick={() => onPageChange(current_page + 1)}
              disabled={current_page === last_page}
              className={`flex items-center cursor-pointer justify-center px-3 h-10 ms-0 leading-tight text-[#95DA66] border border-[#BCBCBC] rounded-md ${
                current_page === last_page
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              title="Next page"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </button>
          </li>

          {/* Last page button */}
          <li>
            <button
              onClick={() => onPageChange(last_page)}
              disabled={current_page === last_page}
              className={`flex items-center justify-center px-3 h-10 ms-0 leading-tight text-[#95DA66] cursor-pointer border border-[#BCBCBC] rounded-md ${
                current_page === last_page
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              title="Last page"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>

      {/* Per page selector */}
      <div className="flex items-center space-x-2 text-sm text-[#BCBCBC] order-last md:order-none">
        <span className="hidden sm:inline">Items per page:</span>
        <span className="sm:hidden">Per page:</span>
        <select
          className="bg-[#2A2A2A] border border-[#959595] text-white rounded-md px-2 py-1 outline-none"
          value={per_page}
          onChange={(e) => onPageChange(1, parseInt(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};

export default CustomPagination;
