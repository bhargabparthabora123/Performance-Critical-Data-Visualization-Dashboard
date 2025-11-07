'use client';

import { useEffect, useRef, useCallback } from 'react';
import { DataPoint } from '@/lib/types';
import { getCanvasContext } from '@/lib/canvasUtils';

interface UseChartRendererOptions {
  data: DataPoint[];
  renderFn: (
    ctx: CanvasRenderingContext2D,
    data: DataPoint[],
    width: number,
    height: number
  ) => void;
  width?: number;
  height?: number;
  animate?: boolean;
}

export function useChartRenderer({
  data,
  renderFn,
  width = 800,
  height = 400,
  animate = true,
}: UseChartRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const render = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    renderFn(ctxRef.current, data, rect.width, rect.height);

    if (animate) {
      animationFrameRef.current = requestAnimationFrame(render);
    }
  }, [data, renderFn, animate]);

  useEffect(() => {
    if (!canvasRef.current) return;

    ctxRef.current = getCanvasContext(canvasRef.current);
    
    if (!ctxRef.current) {
      console.error('Failed to get canvas context');
      return;
    }

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        ctxRef.current = getCanvasContext(canvasRef.current);
        render();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  return { canvasRef };
}
