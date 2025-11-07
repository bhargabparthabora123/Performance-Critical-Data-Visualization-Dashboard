'use client';

import React, { useState, useMemo } from 'react';
import { DataPoint } from '@/lib/types';
import DataProvider, { useData } from '@/components/providers/DataProvider';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import Heatmap from '@/components/charts/Heatmap';
import FilterPanel from '@/components/controls/FilterPanel';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';
import DataTable from '@/components/ui/DataTable';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { generateInitialDataset } from '@/lib/dataGenerator';

type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap';

function DashboardContent() {
  const {
    data,
    filteredData,
    filters,
    timeRange,
    aggregationPeriod,
    isStreaming,
    setFilters,
    setTimeRange,
    setAggregationPeriod,
    toggleStreaming,
    resetData,
  } = useData();

  const { metrics } = usePerformanceMonitor(filteredData.length);
  const [activeChart, setActiveChart] = useState<ChartType>('line');
  const [showTable, setShowTable] = useState(false);

  const minTime = useMemo(() => data[0]?.timestamp || Date.now(), [data]);
  const maxTime = useMemo(() => data[data.length - 1]?.timestamp || Date.now(), [data]);

  const handleIncreaseLoad = () => {
    const newData = generateInitialDataset(data.length + 5000);
    resetData(newData);
  };

  const handleDecreaseLoad = () => {
    const newSize = Math.max(1000, data.length - 5000);
    const newData = generateInitialDataset(newSize);
    resetData(newData);
  };

  const handleStressTest = () => {
    const newData = generateInitialDataset(50000);
    resetData(newData);
  };

  const renderChart = () => {
    const chartProps = {
      data: filteredData,
      width: 800,
      height: 400,
      animate: true,
    };

    switch (activeChart) {
      case 'line':
        return <LineChart {...chartProps} />;
      case 'bar':
        return <BarChart {...chartProps} />;
      case 'scatter':
        return <ScatterPlot {...chartProps} />;
      case 'heatmap':
        return <Heatmap {...chartProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Performance Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time data visualization with {data.length.toLocaleString()} data points
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleStreaming}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isStreaming
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isStreaming ? 'Stop Stream' : 'Start Stream'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <PerformanceMonitor metrics={metrics} />
            
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              aggregationPeriod={aggregationPeriod}
              onAggregationChange={setAggregationPeriod}
            />

            <TimeRangeSelector
              timeRange={timeRange}
              minTime={minTime}
              maxTime={maxTime}
              onTimeRangeChange={setTimeRange}
            />

            {/* Load Controls */}
            <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Load Controls</h3>
              <button
                onClick={handleIncreaseLoad}
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors"
              >
                Increase Load (+5k)
              </button>
              <button
                onClick={handleDecreaseLoad}
                className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors"
              >
                Decrease Load (-5k)
              </button>
              <button
                onClick={handleStressTest}
                className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors"
              >
                Stress Test (50k points)
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Chart Type Selector */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(['line', 'bar', 'scatter', 'heatmap'] as ChartType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                        activeChart === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowTable(!showTable)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showTable
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showTable ? 'Hide Table' : 'Show Table'}
                </button>
              </div>
            </div>

            {/* Chart Display */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-full h-[500px]">
                {renderChart()}
              </div>
            </div>

            {/* Data Table */}
            {showTable && (
              <DataTable data={filteredData} maxHeight={400} />
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.length.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Filtered Points</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredData.length.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Current FPS</p>
                <p className={`text-2xl font-bold ${
                  metrics.fps >= 55 ? 'text-green-600' : 
                  metrics.fps >= 30 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {metrics.fps}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ initialData }: { initialData: DataPoint[] }) {
  return (
    <DataProvider initialData={initialData}>
      <DashboardContent />
    </DataProvider>
  );
}
