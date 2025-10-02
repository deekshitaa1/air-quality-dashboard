import { useMemo } from 'react';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  size?: number;
}

export function GaugeChart({ value, min = 0, max = 500, label = 'AQI', size = 200 }: GaugeChartProps) {
  const { percentage, color, category } = useMemo(() => {
    const pct = ((value - min) / (max - min)) * 100;

    let col = '#00e400';
    let cat = 'Good';

    if (value > 300) {
      col = '#7e0023';
      cat = 'Hazardous';
    } else if (value > 200) {
      col = '#8f3f97';
      cat = 'Very Unhealthy';
    } else if (value > 150) {
      col = '#ff0000';
      cat = 'Unhealthy';
    } else if (value > 100) {
      col = '#ff7e00';
      cat = 'Unhealthy for SG';
    } else if (value > 50) {
      col = '#ffff00';
      cat = 'Moderate';
    }

    return { percentage: pct, color: col, category: cat };
  }, [value, min, max]);

  const radius = size / 2 - 10;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="transform rotate-180">
          <path
            d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="text-4xl font-bold text-gray-900">{Math.round(value)}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>

      <div
        className="mt-2 px-4 py-1 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {category}
      </div>
    </div>
  );
}
