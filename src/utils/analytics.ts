import { AirQualityReading, City } from '../data/airQualityData';

export interface CityStats {
  cityId: string;
  cityName: string;
  avgAQI: number;
  maxAQI: number;
  minAQI: number;
  avgPM25: number;
  avgPM10: number;
  avgNO2: number;
  avgSO2: number;
  avgO3: number;
  avgCO: number;
  goodDays: number;
  moderateDays: number;
  unhealthyDays: number;
}

export function calculateCityStats(
  readings: AirQualityReading[],
  cities: City[]
): CityStats[] {
  return cities.map(city => {
    const cityReadings = readings.filter(r => r.cityId === city.id);

    if (cityReadings.length === 0) {
      return {
        cityId: city.id,
        cityName: city.name,
        avgAQI: 0,
        maxAQI: 0,
        minAQI: 0,
        avgPM25: 0,
        avgPM10: 0,
        avgNO2: 0,
        avgSO2: 0,
        avgO3: 0,
        avgCO: 0,
        goodDays: 0,
        moderateDays: 0,
        unhealthyDays: 0,
      };
    }

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr: number[]) => sum(arr) / arr.length;

    const aqiValues = cityReadings.map(r => r.aqi);
    const goodDays = cityReadings.filter(r => r.aqi <= 50).length;
    const moderateDays = cityReadings.filter(r => r.aqi > 50 && r.aqi <= 100).length;
    const unhealthyDays = cityReadings.filter(r => r.aqi > 100).length;

    return {
      cityId: city.id,
      cityName: city.name,
      avgAQI: Math.round(avg(aqiValues)),
      maxAQI: Math.max(...aqiValues),
      minAQI: Math.min(...aqiValues),
      avgPM25: Math.round(avg(cityReadings.map(r => r.pm25)) * 10) / 10,
      avgPM10: Math.round(avg(cityReadings.map(r => r.pm10)) * 10) / 10,
      avgNO2: Math.round(avg(cityReadings.map(r => r.no2)) * 10) / 10,
      avgSO2: Math.round(avg(cityReadings.map(r => r.so2)) * 10) / 10,
      avgO3: Math.round(avg(cityReadings.map(r => r.o3)) * 10) / 10,
      avgCO: Math.round(avg(cityReadings.map(r => r.co)) * 100) / 100,
      goodDays,
      moderateDays,
      unhealthyDays,
    };
  });
}

export function getWorstAndBestCities(stats: CityStats[]): {
  worst: CityStats | null;
  best: CityStats | null;
} {
  if (stats.length === 0) return { worst: null, best: null };

  const sorted = [...stats].sort((a, b) => b.avgAQI - a.avgAQI);
  return {
    worst: sorted[0],
    best: sorted[sorted.length - 1],
  };
}

export function aggregateByMonth(readings: AirQualityReading[]): Array<{
  month: string;
  avgAQI: number;
  count: number;
}> {
  const monthlyData = new Map<string, number[]>();

  readings.forEach(reading => {
    const month = reading.date.substring(0, 7);
    if (!monthlyData.has(month)) {
      monthlyData.set(month, []);
    }
    monthlyData.get(month)!.push(reading.aqi);
  });

  return Array.from(monthlyData.entries())
    .map(([month, aqis]) => ({
      month,
      avgAQI: Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length),
      count: aqis.length,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getPollutantContribution(readings: AirQualityReading[]): Array<{
  pollutant: string;
  value: number;
}> {
  if (readings.length === 0) return [];

  const totals = readings.reduce(
    (acc, r) => ({
      pm25: acc.pm25 + r.pm25,
      pm10: acc.pm10 + r.pm10,
      no2: acc.no2 + r.no2,
      so2: acc.so2 + r.so2,
      o3: acc.o3 + r.o3,
      co: acc.co + r.co * 100,
    }),
    { pm25: 0, pm10: 0, no2: 0, so2: 0, o3: 0, co: 0 }
  );

  return [
    { pollutant: 'PM2.5', value: Math.round(totals.pm25 / readings.length) },
    { pollutant: 'PM10', value: Math.round(totals.pm10 / readings.length) },
    { pollutant: 'NO₂', value: Math.round(totals.no2 / readings.length) },
    { pollutant: 'SO₂', value: Math.round(totals.so2 / readings.length) },
    { pollutant: 'O₃', value: Math.round(totals.o3 / readings.length) },
    { pollutant: 'CO', value: Math.round(totals.co / readings.length) },
  ];
}
