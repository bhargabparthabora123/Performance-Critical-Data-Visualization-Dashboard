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

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  width?: number;
  height?: number;
  animate?: boolean;
}

export default function LineChart({
  data,
  color = '#3b82f6',
  width = 800,
  height = 400,
  animate = true,
}: LineChartProps) {
  const memoizedData = useMemo(() => data, [data]);

  const renderChart = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      chartData: DataPoint[],
      canvasWidth: number,
      canvasHeight: number
    ) => {
      // Clear canvas
      clearCanvas(ctx, canvasWidth, canvasHeight);

      if (chartData.length === 0) return;

      // Calculate bounds
      const bounds = calculateBounds(chartData, canvasWidth, canvasHeight);

      // Draw grid and axes
      drawGrid(ctx, bounds);
      drawAxes(ctx, bounds);
      drawLabels(ctx, bounds);

      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      
      chartData.forEach((point, index) => {
        const x = scaleX(point.timestamp, bounds);
        const y = scaleY(point.value, bounds);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points (only for smaller datasets to maintain performance)
      if (chartData.length < 1000) {
        ctx.fillStyle = color;
        chartData.forEach((point) => {
          const x = scaleX(point.timestamp, bounds);
          const y = scaleY(point.value, bounds);
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
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
