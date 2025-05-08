import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ page, lastPage, setPage }) {
  const getPageNumbers = () => {
    const delta = 1; // Reduced to show fewer pages
    const range = [];
    const rangeWithDots = [];

    range.push(1);
    for (let i = page - delta; i <= page + delta; i++) {
      if (i > 1 && i < lastPage) {
        range.push(i);
      }
    }
    if (lastPage > 1) {
      range.push(lastPage);
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-end items-center gap-2 py-2 px-4">
      <div className="text-xs text-gray-500">
        Page {page} of {lastPage}
      </div>

      <nav className="flex items-center space-x-1" aria-label="Pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="p-0.5 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-3 w-3" />
        </button>

        <div className="hidden sm:flex space-x-1">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span
                key={`dots-${index}`}
                className="px-1.5 py-0.5 text-xs text-gray-500"
              >
                &#8230;
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`min-w-[1.5rem] px-1.5 py-0.5 border text-xs font-medium rounded
                  ${page === pageNum
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={page === lastPage}
          className="p-0.5 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-3 w-3" />
        </button>
      </nav>
    </div>
  );
}
