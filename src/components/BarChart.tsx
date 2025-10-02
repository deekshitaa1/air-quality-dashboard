interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  orientation?: 'vertical' | 'horizontal';
}

export function BarChart({ data, height = 300, orientation = 'vertical' }: BarChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-gray-400" style={{ height }}>
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  if (orientation === 'horizontal') {
    return (
      <div className="space-y-3" style={{ height }}>
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3b82f6',
                }}
              >
                <span className="text-xs font-bold text-white drop-shadow">
                  {Math.round(item.value)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2 px-4" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-full flex flex-col items-center justify-end flex-1">
            <div
              className="w-full rounded-t-lg transition-all duration-500 relative group"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#3b82f6',
                minHeight: '4px',
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                {Math.round(item.value)}
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-gray-600 text-center truncate w-full">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
