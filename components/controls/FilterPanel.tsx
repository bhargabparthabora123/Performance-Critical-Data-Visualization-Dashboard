'use client';

import React from 'react';
import { FilterOptions, AggregationPeriod } from '@/lib/types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  aggregationPeriod: AggregationPeriod;
  onAggregationChange: (period: AggregationPeriod) => void;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  aggregationPeriod,
  onAggregationChange,
}: FilterPanelProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleValueRangeChange = (type: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      valueRange: {
        ...filters.valueRange,
        [type]: value,
      },
    });
  };

  const categories = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filters.categories.includes(cat)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Value Range</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 w-12">Min:</label>
            <input
              type="number"
              value={filters.valueRange.min}
              onChange={(e) => handleValueRangeChange('min', Number(e.target.value))}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 w-12">Max:</label>
            <input
              type="number"
              value={filters.valueRange.max}
              onChange={(e) => handleValueRangeChange('max', Number(e.target.value))}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Aggregation</h3>
        <div className="flex gap-2">
          {(['1min', '5min', '1hour'] as AggregationPeriod[]).map(period => (
            <button
              key={period}
              onClick={() => onAggregationChange(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                aggregationPeriod === period
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
