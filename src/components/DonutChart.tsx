import { useMemo } from 'react';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  innerRadius?: number;
}

export function DonutChart({ data, size = 200, innerRadius = 0.6 }: DonutChartProps) {
  const { segments, total } = useMemo(() => {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;

    const segs = data.map(item => {
      const percentage = (item.value / totalValue) * 100;
      const angle = (item.value / totalValue) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
      };
    });

    return { segments: segs, total: totalValue };
  }, [data]);

  const radius = size / 2;
  const innerR = radius * innerRadius;

  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: radius + r * Math.cos(rad),
      y: radius + r * Math.sin(rad),
    };
  };

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const innerStart = polarToCartesian(endAngle, innerR);
    const innerEnd = polarToCartesian(startAngle, innerR);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}
      L ${innerStart.x} ${innerStart.y}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
      Z
    `;
  };

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-gray-400" style={{ width: size, height: size }}>
        No data
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((segment, i) => (
            <g key={i}>
              <path
                d={createArc(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
            </g>
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-2xl font-bold text-gray-800">{Math.round(total)}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700 truncate">
                {segment.label}
              </div>
              <div className="text-xs text-gray-500">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
