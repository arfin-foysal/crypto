import React from 'react';

const TableSkeleton = ({ 
  columns = 3, 
  rows = 5, 
  showActions = true,
  imageColumn = false 
}) => {
  return (
    <div className="w-full">
      {/* Skeleton Header */}
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-12 bg-gray-50">
          {imageColumn && (
            <div className="col-span-3 px-6 py-3">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
          {[...Array(columns)].map((_, index) => (
            <div 
              key={`header-${index}`} 
              className={`${imageColumn ? 'col-span-2' : 'col-span-3'} px-6 py-3`}
            >
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
          {showActions && (
            <div className="col-span-3 px-6 py-3 text-right">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-gray-200 bg-white">
        {[...Array(rows)].map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`} 
            className="grid grid-cols-12 hover:bg-gray-50"
          >
            {/* Image Column */}
            {imageColumn && (
              <div className="col-span-3 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Columns */}
            {[...Array(columns)].map((_, colIndex) => (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className={`${imageColumn ? 'col-span-2' : 'col-span-3'} px-6 py-4`}
              >
                <div className="space-y-2">
                  <div 
                    className="h-4 bg-gray-200 rounded animate-pulse" 
                    style={{ 
                      width: `${Math.floor(Math.random() * (100 - 60) + 60)}%`,
                      animationDelay: `${(rowIndex * 0.1) + (colIndex * 0.1)}s`
                    }}
                  ></div>
                  {Math.random() > 0.5 && (
                    <div 
                      className="h-3 bg-gray-200 rounded animate-pulse"
                      style={{ 
                        width: `${Math.floor(Math.random() * (70 - 30) + 30)}%`,
                        animationDelay: `${(rowIndex * 0.1) + (colIndex * 0.1)}s`
                      }}
                    ></div>
                  )}
                </div>
              </div>
            ))}

            {/* Actions Column */}
            {showActions && (
              <div className="col-span-3 px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;