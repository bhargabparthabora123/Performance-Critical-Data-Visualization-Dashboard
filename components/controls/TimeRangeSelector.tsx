'use client';

import React from 'react';
import { TimeRange } from '@/lib/types';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  minTime: number;
  maxTime: number;
  onTimeRangeChange: (range: TimeRange) => void;
}

export default function TimeRangeSelector({
  timeRange,
  minTime,
  maxTime,
  onTimeRangeChange,
}: TimeRangeSelectorProps) {
  const handleStartChange = (value: number) => {
    onTimeRangeChange({
      ...timeRange,
      start: Math.min(value, timeRange.end),
    });
  };

  const handleEndChange = (value: number) => {
    onTimeRangeChange({
      ...timeRange,
      end: Math.max(value, timeRange.start),
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const startPercent = ((timeRange.start - minTime) / (maxTime - minTime)) * 100;
  const endPercent = ((timeRange.end - minTime) / (maxTime - minTime)) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Time Range</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Start: {formatTime(timeRange.start)}</span>
          </div>
          <input
            type="range"
            min={minTime}
            max={maxTime}
            value={timeRange.start}
            onChange={(e) => handleStartChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>End: {formatTime(timeRange.end)}</span>
          </div>
          <input
            type="range"
            min={minTime}
            max={maxTime}
            value={timeRange.end}
            onChange={(e) => handleEndChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="relative h-2 bg-gray-200 rounded-lg">
          <div
            className="absolute h-full bg-blue-500 rounded-lg"
            style={{
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(minTime)}</span>
          <span>{formatTime(maxTime)}</span>
        </div>
      </div>

      <button
        onClick={() => onTimeRangeChange({ start: minTime, end: maxTime })}
        className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded transition-colors"
      >
        Reset Range
      </button>
    </div>
  );
}
