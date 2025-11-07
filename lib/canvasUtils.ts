import { DataPoint, ChartBounds } from './types';

export function getCanvasContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d', {
    alpha: false,
    desynchronized: true,
  });
  
  if (ctx) {
    // Set high DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }
  
  return ctx;
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
}

export function calculateBounds(
  data: DataPoint[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number } = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60,
  }
): ChartBounds {
  const values = data.map(d => d.value);
  const timestamps = data.map(d => d.timestamp);
  
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const minX = Math.min(...timestamps);
  const maxX = Math.max(...timestamps);
  
  // Add 10% padding to Y axis
  const yRange = maxY - minY;
  const yPadding = yRange * 0.1;
  
  return {
    minX,
    maxX,
    minY: minY - yPadding,
    maxY: maxY + yPadding,
    width,
    height,
    paddingLeft: padding.left,
    paddingRight: padding.right,
    paddingTop: padding.top,
    paddingBottom: padding.bottom,
  };
}

export function scaleX(value: number, bounds: ChartBounds): number {
  const chartWidth = bounds.width - bounds.paddingLeft - bounds.paddingRight;
  const range = bounds.maxX - bounds.minX;
  return bounds.paddingLeft + ((value - bounds.minX) / range) * chartWidth;
}

export function scaleY(value: number, bounds: ChartBounds): number {
  const chartHeight = bounds.height - bounds.paddingTop - bounds.paddingBottom;
  const range = bounds.maxY - bounds.minY;
  return bounds.height - bounds.paddingBottom - ((value - bounds.minY) / range) * chartHeight;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  bounds: ChartBounds,
  gridLines: number = 5
): void {
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  
  const chartWidth = bounds.width - bounds.paddingLeft - bounds.paddingRight;
  const chartHeight = bounds.height - bounds.paddingTop - bounds.paddingBottom;
  
  // Horizontal grid lines
  for (let i = 0; i <= gridLines; i++) {
    const y = bounds.paddingTop + (chartHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(bounds.paddingLeft, y);
    ctx.lineTo(bounds.paddingLeft + chartWidth, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i <= gridLines; i++) {
    const x = bounds.paddingLeft + (chartWidth / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(x, bounds.paddingTop);
    ctx.lineTo(x, bounds.paddingTop + chartHeight);
    ctx.stroke();
  }
}

export function drawAxes(
  ctx: CanvasRenderingContext2D,
  bounds: ChartBounds
): void {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  
  const chartWidth = bounds.width - bounds.paddingLeft - bounds.paddingRight;
  const chartHeight = bounds.height - bounds.paddingTop - bounds.paddingBottom;
  
  // Y axis
  ctx.beginPath();
  ctx.moveTo(bounds.paddingLeft, bounds.paddingTop);
  ctx.lineTo(bounds.paddingLeft, bounds.paddingTop + chartHeight);
  ctx.stroke();
  
  // X axis
  ctx.beginPath();
  ctx.moveTo(bounds.paddingLeft, bounds.paddingTop + chartHeight);
  ctx.lineTo(bounds.paddingLeft + chartWidth, bounds.paddingTop + chartHeight);
  ctx.stroke();
}

export function drawLabels(
  ctx: CanvasRenderingContext2D,
  bounds: ChartBounds,
  labelCount: number = 5
): void {
  ctx.fillStyle = '#374151';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const chartHeight = bounds.height - bounds.paddingTop - bounds.paddingBottom;
  
  // Y axis labels
  for (let i = 0; i <= labelCount; i++) {
    const value = bounds.minY + ((bounds.maxY - bounds.minY) / labelCount) * i;
    const y = bounds.height - bounds.paddingBottom - (chartHeight / labelCount) * i;
    ctx.fillText(value.toFixed(1), bounds.paddingLeft - 10, y);
  }
  
  // X axis labels (timestamps)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const chartWidth = bounds.width - bounds.paddingLeft - bounds.paddingRight;
  
  for (let i = 0; i <= labelCount; i++) {
    const timestamp = bounds.minX + ((bounds.maxX - bounds.minX) / labelCount) * i;
    const x = bounds.paddingLeft + (chartWidth / labelCount) * i;
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    ctx.fillText(timeStr, x, bounds.height - bounds.paddingBottom + 5);
  }
}
