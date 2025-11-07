'use client';

import React from 'react';
import { PerformanceMetrics } from '@/lib/types';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
}

export default function PerformanceMonitor({ metrics }: PerformanceMonitorProps) {
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 100) return 'text-green-600';
    if (memory < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg font-mono text-sm">
      <h3 className="text-base font-bold mb-3 text-gray-300">Performance Metrics</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">FPS:</span>
          <span className={`font-bold text-lg ${getFPSColor(metrics.fps)}`}>
            {metrics.fps}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Memory:</span>
          <span className={`font-bold ${getMemoryColor(metrics.memoryUsage)}`}>
            {metrics.memoryUsage} MB
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Render Time:</span>
          <span className="text-blue-400">
            {metrics.renderTime.toFixed(2)} ms
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Processing:</span>
          <span className="text-purple-400">
            {metrics.dataProcessingTime.toFixed(2)} ms
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Data Points:</span>
          <span className="text-cyan-400">
            {metrics.dataPointsCount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              metrics.fps >= 55
                ? 'bg-green-500'
                : metrics.fps >= 30
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${(metrics.fps / 60) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Target: 60 FPS
        </p>
      </div>
    </div>
  );
}
