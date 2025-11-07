'use client';

import React, { useCallback, useMemo } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { clearCanvas } from '@/lib/canvasUtils';

interface HeatmapProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  animate?: boolean;
}

export default function Heatmap({
  data,
  width = 800,
  height = 400,
  animate = true,
}: HeatmapProps) {
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

      const padding = { top: 40, right: 100, bottom: 40, left: 60 };
      
      // Group data by category and time buckets
      const categories = ['A', 'B', 'C', 'D', 'E'];
      const bucketSize = Math.ceil(chartData.length / 50); // Create ~50 time buckets
      const buckets: Map<string, number[][]> = new Map();

      categories.forEach(cat => {
        buckets.set(cat, []);
      });

      // Aggregate data into buckets
      for (let i = 0; i < chartData.length; i += bucketSize) {
        const bucket = chartData.slice(i, i + bucketSize);
        
        categories.forEach(cat => {
          const values = bucket.filter(d => d.category === cat).map(d => d.value);
          const avg = values.length > 0 
            ? values.reduce((sum, v) => sum + v, 0) / values.length 
            : 0;
          buckets.get(cat)!.push([i / bucketSize, avg]);
        });
      }

      // Find min/max values for color scaling
      let minVal = Infinity;
      let maxVal = -Infinity;
      
      buckets.forEach(categoryBuckets => {
        categoryBuckets.forEach(([_, value]) => {
          minVal = Math.min(minVal, value);
          maxVal = Math.max(maxVal, value);
        });
      });

      const chartWidth = canvasWidth - padding.left - padding.right;
      const chartHeight = canvasHeight - padding.top - padding.bottom;
      
      const numBuckets = Math.ceil(chartData.length / bucketSize);
      const cellWidth = chartWidth / numBuckets;
      const cellHeight = chartHeight / categories.length;

      // Draw heatmap cells
      categories.forEach((cat, catIndex) => {
        const categoryBuckets = buckets.get(cat)!;
        
        categoryBuckets.forEach(([bucketIndex, value]) => {
          const x = padding.left + bucketIndex * cellWidth;
          const y = padding.top + catIndex * cellHeight;
          
          // Color interpolation from blue (low) to red (high)
          const normalized = (value - minVal) / (maxVal - minVal || 1);
          const hue = (1 - normalized) * 240; // 240 = blue, 0 = red
          
          ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
          ctx.fillRect(x, y, cellWidth, cellHeight);
        });
      });

      // Draw labels
      ctx.fillStyle = '#374151';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      categories.forEach((cat, index) => {
        const y = padding.top + index * cellHeight + cellHeight / 2;
        ctx.fillText(`Category ${cat}`, padding.left - 10, y);
      });

      // Draw color scale legend
      const legendWidth = 20;
      const legendHeight = chartHeight;
      const legendX = canvasWidth - padding.right + 20;
      const legendY = padding.top;

      for (let i = 0; i < legendHeight; i++) {
        const normalized = i / legendHeight;
        const hue = (1 - normalized) * 240;
        ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
        ctx.fillRect(legendX, legendY + i, legendWidth, 1);
      }

      // Legend labels
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'left';
      ctx.fillText(maxVal.toFixed(1), legendX + legendWidth + 5, legendY);
      ctx.fillText(minVal.toFixed(1), legendX + legendWidth + 5, legendY + legendHeight);
    },
    []
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
