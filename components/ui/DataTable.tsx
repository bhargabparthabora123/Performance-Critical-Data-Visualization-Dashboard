'use client';

import React from 'react';
import { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';

interface DataTableProps {
  data: DataPoint[];
  maxHeight?: number;
}

export default function DataTable({ data, maxHeight = 400 }: DataTableProps) {
  const { visibleItems, totalHeight, handleScroll } = useVirtualization({
    items: data,
    itemHeight: 40,
    containerHeight: maxHeight,
    overscan: 5,
  });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Data Table ({data.length.toLocaleString()} rows)
        </h3>
      </div>

      <div
        className="overflow-auto"
        style={{ height: maxHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Index
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Timestamp
                </th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700">
                  Value
                </th>
                <th className="px-4 py-2 text-center font-semibold text-gray-700">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map(({ item, index, offsetTop }) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  style={{
                    position: 'absolute',
                    top: offsetTop,
                    left: 0,
                    right: 0,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <td
                    className="px-4 text-gray-600"
                    style={{ width: '15%', minWidth: '80px' }}
                  >
                    {index}
                  </td>
                  <td
                    className="px-4 text-gray-600"
                    style={{ width: '40%', minWidth: '200px' }}
                  >
                    {formatTimestamp(item.timestamp)}
                  </td>
                  <td
                    className="px-4 text-right font-mono text-gray-900"
                    style={{ width: '25%', minWidth: '100px' }}
                  >
                    {item.value.toFixed(2)}
                  </td>
                  <td
                    className="px-4 text-center"
                    style={{ width: '20%', minWidth: '80px' }}
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
