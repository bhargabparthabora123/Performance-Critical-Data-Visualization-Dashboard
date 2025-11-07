'use client';

import React, { useCallback, useMemo } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import {
  clearCanvas,
  calculateBounds,
  scaleX,
  scaleY,
  drawGrid,
  drawAxes,
  drawLabels,
} from '@/lib/canvasUtils';

interface BarChartProps {
  data: DataPoint[];
  color?: string;
  width?: number;
  height?: number;
  animate?: boolean;
}

export default function BarChart({
  data,
  color = '#10b981',
  width = 800,
  height = 400,
  animate = true,
}: BarChartProps) {
  const memoizedData = useMemo(() => data, [data]);

  const renderChart = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      chartData: DataPoint[],
      canvasWidth: number,
      canvasHeight: number
    ) => {
      clearCanvas(ctx, canvasWidth, canvasHeight);

      if (chartData.length === 0) return;

      const bounds = calculateBounds(chartData, canvasWidth, canvasHeight);

      drawGrid(ctx, bounds);
      drawAxes(ctx, bounds);
      drawLabels(ctx, bounds);

      // Calculate bar width
      const chartWidth = bounds.width - bounds.paddingLeft - bounds.paddingRight;
      const barWidth = Math.max(1, chartWidth / chartData.length * 0.8);

      ctx.fillStyle = color;

      chartData.forEach((point) => {
        const x = scaleX(point.timestamp, bounds);
        const y = scaleY(point.value, bounds);
        const baseY = scaleY(bounds.minY, bounds);
        const barHeight = baseY - y;

        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
      });
    },
    [color]
  );

  const { canvasRef } = useChartRenderer({
    data: memoizedData,
    renderFn: renderChart,
    width,
    height,
    animate,
  });

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
