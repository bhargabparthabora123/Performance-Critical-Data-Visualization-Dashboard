import { NextResponse } from 'next/server';
import { generateInitialDataset } from '@/lib/dataGenerator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10000', 10);

  const data = generateInitialDataset(Math.min(count, 100000));

  return NextResponse.json({
    data,
    count: data.length,
    timestamp: Date.now(),
  });
}
