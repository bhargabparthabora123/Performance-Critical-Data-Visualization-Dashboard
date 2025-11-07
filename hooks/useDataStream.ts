'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { generateRealtimeData } from '@/lib/dataGenerator';

interface UseDataStreamOptions {
  initialData: DataPoint[];
  interval?: number;
  maxPoints?: number;
  enabled?: boolean;
}

export function useDataStream({
  initialData,
  interval = 100,
  maxPoints = 10000,
  enabled = true,
}: UseDataStreamOptions) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const intervalRef = useRef<NodeJS.Timeout>();

  const addDataPoint = useCallback(() => {
    setData(prevData => {
      const lastTimestamp = prevData[prevData.length - 1]?.timestamp || Date.now();
      const newPoint = generateRealtimeData(lastTimestamp);
      
      // Use sliding window to maintain max points
      const newData = [...prevData, newPoint];
      if (newData.length > maxPoints) {
        return newData.slice(newData.length - maxPoints);
      }
      
      return newData;
    });
  }, [maxPoints]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(addDataPoint, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, addDataPoint]);

  const resetData = useCallback((newData: DataPoint[]) => {
    setData(newData);
  }, []);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  return {
    data,
    resetData,
    clearData,
    addDataPoint,
  };
}
