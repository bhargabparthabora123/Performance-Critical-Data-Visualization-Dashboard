'use client';

import { useState, useEffect, useRef } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { PerformanceMonitor, getMemoryUsage } from '@/lib/performanceUtils';

export function usePerformanceMonitor(dataPointsCount: number = 0) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    dataPointsCount,
  });

  const monitorRef = useRef<PerformanceMonitor | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor();

    const updateMetrics = () => {
      if (monitorRef.current) {
        monitorRef.current.update();
        
        setMetrics(prev => ({
          ...prev,
          fps: monitorRef.current!.getFPS(),
          memoryUsage: getMemoryUsage(),
          dataPointsCount,
        }));
      }

      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    };

    animationFrameRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dataPointsCount]);

  const recordRenderTime = (time: number) => {
    setMetrics(prev => ({ ...prev, renderTime: time }));
  };

  const recordProcessingTime = (time: number) => {
    setMetrics(prev => ({ ...prev, dataProcessingTime: time }));
  };

  return { metrics, recordRenderTime, recordProcessingTime };
}
