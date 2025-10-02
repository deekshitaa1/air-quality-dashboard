interface HeatMapCell {
  label: string;
  value: number;
}

interface HeatMapProps {
  data: HeatMapCell[][];
  rowLabels: string[];
  columnLabels: string[];
  colorScale?: (value: number, min: number, max: number) => string;
}

const defaultColorScale = (value: number, min: number, max: number): string => {
  const normalized = (value - min) / (max - min || 1);

  if (normalized <= 0.2) return '#00e400';
  if (normalized <= 0.4) return '#ffff00';
  if (normalized <= 0.6) return '#ff7e00';
  if (normalized <= 0.8) return '#ff0000';
  return '#8f3f97';
};

export function HeatMap({
  data,
  rowLabels,
  columnLabels,
  colorScale = defaultColorScale
}: HeatMapProps) {
  if (!data.length || !data[0].length) {
    return (
      <div className="flex items-center justify-center text-gray-400 h-64">
        No data available
      </div>
    );
  }

  const allValues = data.flat().map(cell => cell.value);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${columnLabels.length}, 1fr)` }}>
          <div></div>
          {columnLabels.map((label, i) => (
            <div key={i} className="text-xs font-medium text-gray-600 text-center px-2 py-1">
              {label}
            </div>
          ))}

          {data.map((row, rowIndex) => (
            <>
              <div key={`label-${rowIndex}`} className="text-xs font-medium text-gray-600 flex items-center pr-2">
                {rowLabels[rowIndex]}
              </div>
              {row.map((cell, colIndex) => {
                const bgColor = colorScale(cell.value, minValue, maxValue);
                const textColor = cell.value > (maxValue - minValue) * 0.6 + minValue ? '#ffffff' : '#000000';

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="aspect-square flex items-center justify-center text-xs font-bold rounded transition-transform hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: bgColor, color: textColor }}
                    title={`${cell.label}: ${Math.round(cell.value)}`}
                  >
                    {Math.round(cell.value)}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-gray-600">AQI Scale:</span>
          <div className="flex items-center gap-1">
            {[
              { color: '#00e400', label: 'Good' },
              { color: '#ffff00', label: 'Moderate' },
              { color: '#ff7e00', label: 'Unhealthy SG' },
              { color: '#ff0000', label: 'Unhealthy' },
              { color: '#8f3f97', label: 'Very Unhealthy' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
