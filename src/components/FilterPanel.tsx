import { City } from '../data/airQualityData';

interface FilterPanelProps {
  cities: City[];
  selectedCities: string[];
  onCityChange: (cityIds: string[]) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedPollutant: string;
  onPollutantChange: (pollutant: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

const pollutants = [
  { value: 'aqi', label: 'AQI (Overall)' },
  { value: 'pm25', label: 'PM2.5' },
  { value: 'pm10', label: 'PM10' },
  { value: 'no2', label: 'NO₂' },
  { value: 'so2', label: 'SO₂' },
  { value: 'o3', label: 'O₃' },
  { value: 'co', label: 'CO' },
];

export function FilterPanel({
  cities,
  selectedCities,
  onCityChange,
  selectedYear,
  onYearChange,
  selectedPollutant,
  onPollutantChange,
  dateRange,
  onDateRangeChange,
}: FilterPanelProps) {
  const handleCityToggle = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      onCityChange(selectedCities.filter(id => id !== cityId));
    } else {
      onCityChange([...selectedCities, cityId]);
    }
  };

  const handleSelectAllCities = () => {
    if (selectedCities.length === cities.length) {
      onCityChange([cities[0].id]);
    } else {
      onCityChange(cities.map(c => c.id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Cities</h3>
          <button
            onClick={handleSelectAllCities}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedCities.length === cities.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="space-y-2">
          {cities.map(city => (
            <label key={city.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCities.includes(city.id)}
                onChange={() => handleCityToggle(city.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {city.name}, {city.country}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Pollutant</h3>
        <select
          value={selectedPollutant}
          onChange={(e) => onPollutantChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {pollutants.map(p => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Year</h3>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Date Range</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
