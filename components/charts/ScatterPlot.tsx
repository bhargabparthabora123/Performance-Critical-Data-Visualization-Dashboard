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

interface ScatterPlotProps {
  data: DataPoint[];
  color?: string;
  width?: number;
  height?: number;
  animate?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  A: '#ef4444',
  B: '#3b82f6',
  C: '#10b981',
  D: '#f59e0b',
  E: '#8b5cf6',
};

export default function ScatterPlot({
  data,
  color = '#8b5cf6',
  width = 800,
  height = 400,
  animate = true,
}: ScatterPlotProps) {
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

      // Draw points
      chartData.forEach((point) => {
        const x = scaleX(point.timestamp, bounds);
        const y = scaleY(point.value, bounds);
        
        ctx.fillStyle = CATEGORY_COLORS[point.category] || color;
        ctx.globalAlpha = 0.6;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;

      // Draw legend
      const legendX = bounds.width - bounds.paddingRight - 100;
      const legendY = bounds.paddingTop + 10;
      
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      Object.entries(CATEGORY_COLORS).forEach(([category, categoryColor], index) => {
        const y = legendY + index * 20;
        
        ctx.fillStyle = categoryColor;
        ctx.beginPath();
        ctx.arc(legendX, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#374151';
        ctx.fillText(`Category ${category}`, legendX + 15, y);
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
