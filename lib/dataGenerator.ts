import { DataPoint } from './types';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];

export function generateInitialDataset(count: number = 10000): DataPoint[] {
  const now = Date.now();
  const data: DataPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      timestamp: now - (count - i) * 1000,
      value: Math.sin(i * 0.01) * 50 + Math.random() * 20 + 50,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      metadata: {
        index: i,
      }
    });
  }
  
  return data;
}

export function generateRealtimeData(lastTimestamp: number): DataPoint {
  return {
    timestamp: lastTimestamp + 100,
    value: Math.sin(Date.now() * 0.001) * 50 + Math.random() * 20 + 50,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    metadata: {
      realtime: true,
    }
  };
}

export function aggregateData(
  data: DataPoint[],
  period: '1min' | '5min' | '1hour'
): DataPoint[] {
  const periodMs = {
    '1min': 60 * 1000,
    '5min': 5 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
  }[period];

  const buckets = new Map<number, DataPoint[]>();

  data.forEach(point => {
    const bucketKey = Math.floor(point.timestamp / periodMs) * periodMs;
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, []);
    }
    buckets.get(bucketKey)!.push(point);
  });

  const aggregated: DataPoint[] = [];
  buckets.forEach((points, timestamp) => {
    const avgValue = points.reduce((sum, p) => sum + p.value, 0) / points.length;
    aggregated.push({
      timestamp,
      value: avgValue,
      category: points[0].category,
      metadata: {
        count: points.length,
        aggregation: period,
      }
    });
  });

  return aggregated.sort((a, b) => a.timestamp - b.timestamp);
}
