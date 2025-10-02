import { useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export function LineChart({ data, color = '#3b82f6', height = 200, showGrid = true }: LineChartProps) {
  const { points, maxValue, minValue, pathD } = useMemo(() => {
    if (!data.length) return { points: [], maxValue: 0, minValue: 0, pathD: '' };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 100;
    const stepX = width / (data.length - 1 || 1);

    const pts = data.map((d, i) => ({
      x: i * stepX,
      y: height - ((d.value - min) / range) * height,
      value: d.value,
      label: d.label,
    }));

    const path = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return { points: pts, maxValue: max, minValue: min, pathD: path };
  }, [data, height]);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-gray-400" style={{ height }}>
        No data available
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {showGrid && (
          <g className="opacity-10">
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={(y / 100) * height}
                x2="100"
                y2={(y / 100) * height}
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))}
          </g>
        )}

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={`${pathD} L 100 ${height} L 0 ${height} Z`}
          fill={color}
          opacity="0.1"
        />

        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={color}
              vectorEffect="non-scaling-stroke"
              className="hover:r-2 transition-all"
            />
          </g>
        ))}
      </svg>

      <div className="absolute top-0 left-0 text-xs text-gray-500 font-medium">
        {Math.round(maxValue)}
      </div>
      <div className="absolute bottom-0 left-0 text-xs text-gray-500 font-medium">
        {Math.round(minValue)}
      </div>
    </div>
  );
}
