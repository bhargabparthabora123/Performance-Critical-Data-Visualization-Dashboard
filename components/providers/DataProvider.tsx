'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useTransition } from 'react';
import { DataPoint, FilterOptions, TimeRange, AggregationPeriod } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
import { aggregateData } from '@/lib/dataGenerator';

interface DataContextValue {
  data: DataPoint[];
  filteredData: DataPoint[];
  filters: FilterOptions;
  timeRange: TimeRange;
  aggregationPeriod: AggregationPeriod;
  isStreaming: boolean;
  setFilters: (filters: FilterOptions) => void;
  setTimeRange: (range: TimeRange) => void;
  setAggregationPeriod: (period: AggregationPeriod) => void;
  toggleStreaming: () => void;
  resetData: (newData: DataPoint[]) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: React.ReactNode;
  initialData: DataPoint[];
}

export default function DataProvider({ children, initialData }: DataProviderProps) {
  const [isStreaming, setIsStreaming] = useState(true);
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('1min');
  const [isPending, startTransition] = useTransition();

  const { data, resetData: resetStreamData } = useDataStream({
    initialData,
    interval: 100,
    maxPoints: 10000,
    enabled: isStreaming,
  });

  const [filters, setFilters] = useState<FilterOptions>({
    categories: ['A', 'B', 'C', 'D', 'E'],
    valueRange: { min: 0, max: 200 },
    timeRange: {
      start: data[0]?.timestamp || Date.now(),
      end: data[data.length - 1]?.timestamp || Date.now(),
    },
  });

  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: data[0]?.timestamp || Date.now(),
    end: data[data.length - 1]?.timestamp || Date.now(),
  });

  // Update time range when data changes
  React.useEffect(() => {
    if (data.length > 0) {
      const newStart = data[0].timestamp;
      const newEnd = data[data.length - 1].timestamp;
      
      setTimeRange(prev => ({
        start: Math.min(prev.start, newStart),
        end: Math.max(prev.end, newEnd),
      }));

      setFilters(prev => ({
        ...prev,
        timeRange: {
          start: Math.min(prev.timeRange.start, newStart),
          end: Math.max(prev.timeRange.end, newEnd),
        },
      }));
    }
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data.filter(point => {
      const categoryMatch = filters.categories.includes(point.category);
      const valueMatch =
        point.value >= filters.valueRange.min &&
        point.value <= filters.valueRange.max;
      const timeMatch =
        point.timestamp >= timeRange.start &&
        point.timestamp <= timeRange.end;

      return categoryMatch && valueMatch && timeMatch;
    });

    // Apply aggregation if needed
    if (aggregationPeriod !== '1min' || filtered.length > 5000) {
      filtered = aggregateData(filtered, aggregationPeriod);
    }

    return filtered;
  }, [data, filters, timeRange, aggregationPeriod]);

  const toggleStreaming = useCallback(() => {
    setIsStreaming(prev => !prev);
  }, []);

  const resetData = useCallback((newData: DataPoint[]) => {
    startTransition(() => {
      resetStreamData(newData);
    });
  }, [resetStreamData]);

  const handleSetAggregationPeriod = useCallback((period: AggregationPeriod) => {
    startTransition(() => {
      setAggregationPeriod(period);
    });
  }, []);

  const value: DataContextValue = {
    data,
    filteredData,
    filters,
    timeRange,
    aggregationPeriod,
    isStreaming,
    setFilters,
    setTimeRange,
    setAggregationPeriod: handleSetAggregationPeriod,
    toggleStreaming,
    resetData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
