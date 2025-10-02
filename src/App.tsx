import { useState, useMemo } from 'react';
import {
  Download,
  Wind,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { cities, airQualityReadings, aqiCategoryColors } from './data/airQualityData';
import { FilterPanel } from './components/FilterPanel';
import { KPICard } from './components/KPICard';
import { LineChart } from './components/LineChart';
import { BarChart } from './components/BarChart';
import { DonutChart } from './components/DonutChart';
import { GaugeChart } from './components/GaugeChart';
import { HeatMap } from './components/HeatMap';
import {
  calculateCityStats,
  getWorstAndBestCities,
  aggregateByMonth,
  getPollutantContribution,
} from './utils/analytics';

function App() {
  const [selectedCities, setSelectedCities] = useState<string[]>([cities[0].id]);
  const [selectedYear] = useState(2024);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31',
  });

  const filteredReadings = useMemo(() => {
    return airQualityReadings.filter(
      reading =>
        selectedCities.includes(reading.cityId) &&
        reading.date >= dateRange.start &&
        reading.date <= dateRange.end
    );
  }, [selectedCities, dateRange]);

  const cityStats = useMemo(
    () => calculateCityStats(filteredReadings, cities.filter(c => selectedCities.includes(c.id))),
    [filteredReadings, selectedCities]
  );

  const { worst, best } = useMemo(() => getWorstAndBestCities(cityStats), [cityStats]);

  const overallStats = useMemo(() => {
    if (filteredReadings.length === 0) {
      return { avgAQI: 0, maxAQI: 0, minAQI: 0, totalReadings: 0 };
    }

    const aqis = filteredReadings.map(r => r.aqi);
    return {
      avgAQI: Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length),
      maxAQI: Math.max(...aqis),
      minAQI: Math.min(...aqis),
      totalReadings: filteredReadings.length,
    };
  }, [filteredReadings]);

  const monthlyTrends = useMemo(() => {
    const aggregated = aggregateByMonth(filteredReadings);
    return aggregated.map(item => ({
      label: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      value: item.avgAQI,
    }));
  }, [filteredReadings]);

  const cityComparison = useMemo(() => {
    return cityStats.map(stat => ({
      label: stat.cityName,
      value: stat.avgAQI,
      color: aqiCategoryColors[
        stat.avgAQI <= 50
          ? 'Good'
          : stat.avgAQI <= 100
          ? 'Moderate'
          : stat.avgAQI <= 150
          ? 'Unhealthy for Sensitive Groups'
          : stat.avgAQI <= 200
          ? 'Unhealthy'
          : stat.avgAQI <= 300
          ? 'Very Unhealthy'
          : 'Hazardous'
      ],
    }));
  }, [cityStats]);

  const pollutantData = useMemo(() => {
    const contribution = getPollutantContribution(filteredReadings);
    return contribution.map((item, i) => ({
      ...item,
      label: item.pollutant,
      color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i],
    }));
  }, [filteredReadings]);

  const heatMapData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      return `2024-${month}`;
    });

    return selectedCities.map(cityId => {
      return months.map(month => {
        const monthReadings = filteredReadings.filter(
          r => r.cityId === cityId && r.date.startsWith(month)
        );

        const avgAQI =
          monthReadings.length > 0
            ? Math.round(
                monthReadings.reduce((sum, r) => sum + r.aqi, 0) / monthReadings.length
              )
            : 0;

        return {
          label: `${cities.find(c => c.id === cityId)?.name} - ${month}`,
          value: avgAQI,
        };
      });
    });
  }, [filteredReadings, selectedCities]);

  const handleExportData = () => {
    const csv = [
      ['Date', 'City', 'PM2.5', 'PM10', 'NO2', 'SO2', 'O3', 'CO', 'AQI', 'Category'],
      ...filteredReadings.map(r => {
        const city = cities.find(c => c.id === r.cityId);
        return [
          r.date,
          city?.name || '',
          r.pm25,
          r.pm10,
          r.no2,
          r.so2,
          r.o3,
          r.co,
          r.aqi,
          r.aqiCategory,
        ];
      }),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'air-quality-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wind className="text-blue-600" size={28} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Air Quality Data Analytics
                </h1>
              </div>
              <p className="text-gray-600">
                Comprehensive AQI monitoring and analysis dashboard
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Export Data
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <FilterPanel
              cities={cities}
              selectedCities={selectedCities}
              onCityChange={setSelectedCities}
              selectedYear={selectedYear}
              onYearChange={() => {}}
              selectedPollutant={selectedPollutant}
              onPollutantChange={setSelectedPollutant}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          <div className="col-span-9 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <KPICard
                title="Average AQI"
                value={overallStats.avgAQI}
                subtitle={`Across ${selectedCities.length} cities`}
                icon={Activity}
                color="#3b82f6"
              />
              <KPICard
                title="Peak AQI"
                value={overallStats.maxAQI}
                subtitle="Maximum recorded"
                icon={TrendingUp}
                color="#ef4444"
              />
              <KPICard
                title="Best City"
                value={best?.cityName || 'N/A'}
                subtitle={best ? `AQI: ${best.avgAQI}` : 'No data'}
                icon={CheckCircle}
                color="#10b981"
              />
              <KPICard
                title="Worst City"
                value={worst?.cityName || 'N/A'}
                subtitle={worst ? `AQI: ${worst.avgAQI}` : 'No data'}
                icon={AlertTriangle}
                color="#f59e0b"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  AQI Trends Over Time
                </h2>
                <LineChart data={monthlyTrends} color="#3b82f6" height={240} />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Current AQI Status
                </h2>
                <div className="flex items-center justify-center">
                  <GaugeChart value={overallStats.avgAQI} size={240} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                City Comparison - Average AQI
              </h2>
              <BarChart data={cityComparison} height={280} orientation="vertical" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pollutant Breakdown
                </h2>
                <div className="flex justify-center">
                  <DonutChart data={pollutantData} size={280} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Average Pollutant Levels
                </h2>
                <BarChart data={pollutantData} height={280} orientation="horizontal" />
              </div>
            </div>

            {heatMapData.length > 0 && heatMapData[0].length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly AQI Heatmap
                </h2>
                <HeatMap
                  data={heatMapData}
                  rowLabels={selectedCities.map(
                    id => cities.find(c => c.id === id)?.name || ''
                  )}
                  columnLabels={[
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ]}
                />
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
              <div className="space-y-3">
                {worst && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-red-900">
                        {worst.cityName} has the highest pollution levels
                      </p>
                      <p className="text-sm text-red-700">
                        Average AQI of {worst.avgAQI} with {worst.unhealthyDays} unhealthy days
                        recorded
                      </p>
                    </div>
                  </div>
                )}
                {best && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-green-900">
                        {best.cityName} maintains the best air quality
                      </p>
                      <p className="text-sm text-green-700">
                        Average AQI of {best.avgAQI} with {best.goodDays} good air quality days
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Activity className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-blue-900">Dataset Overview</p>
                    <p className="text-sm text-blue-700">
                      Analyzing {overallStats.totalReadings} readings across {selectedCities.length}{' '}
                      cities from {dateRange.start} to {dateRange.end}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
