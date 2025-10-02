export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface AirQualityReading {
  id: string;
  cityId: string;
  date: string;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

export const cities: City[] = [
  { id: 'city-1', name: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437 },
  { id: 'city-2', name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { id: 'city-3', name: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074 },
  { id: 'city-4', name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  { id: 'city-5', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
];

function getAQICategory(aqi: number): AirQualityReading['aqiCategory'] {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function generateReadingsForCity(cityId: string, cityName: string): AirQualityReading[] {
  const readings: AirQualityReading[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  const baselinePollution: Record<string, { pm25: number; pm10: number; no2: number; so2: number; o3: number; co: number }> = {
    'Los Angeles': { pm25: 25, pm10: 45, no2: 35, so2: 15, o3: 55, co: 0.8 },
    'New Delhi': { pm25: 95, pm10: 180, no2: 65, so2: 25, o3: 45, co: 1.5 },
    'Beijing': { pm25: 75, pm10: 140, no2: 55, so2: 30, o3: 50, co: 1.2 },
    'London': { pm25: 18, pm10: 35, no2: 40, so2: 12, o3: 48, co: 0.6 },
    'Tokyo': { pm25: 20, pm10: 38, no2: 30, so2: 10, o3: 42, co: 0.7 },
  };

  const baseline = baselinePollution[cityName];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfYear = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const seasonalFactor = 1 + 0.3 * Math.sin((dayOfYear / 365) * 2 * Math.PI);
    const randomFactor = 0.7 + Math.random() * 0.6;

    const pm25 = Math.max(0, baseline.pm25 * seasonalFactor * randomFactor);
    const pm10 = Math.max(0, baseline.pm10 * seasonalFactor * randomFactor);
    const no2 = Math.max(0, baseline.no2 * seasonalFactor * randomFactor);
    const so2 = Math.max(0, baseline.so2 * seasonalFactor * randomFactor);
    const o3 = Math.max(0, baseline.o3 * (2 - seasonalFactor) * randomFactor);
    const co = Math.max(0, baseline.co * seasonalFactor * randomFactor);

    const pm25AQI = pm25 <= 12 ? (pm25 / 12) * 50 : pm25 <= 35.4 ? 50 + ((pm25 - 12) / 23.4) * 50 : pm25 <= 55.4 ? 100 + ((pm25 - 35.4) / 20) * 50 : pm25 <= 150.4 ? 150 + ((pm25 - 55.4) / 95) * 50 : pm25 <= 250.4 ? 200 + ((pm25 - 150.4) / 100) * 100 : 300 + ((pm25 - 250.4) / 150) * 200;
    const pm10AQI = pm10 <= 54 ? (pm10 / 54) * 50 : pm10 <= 154 ? 50 + ((pm10 - 54) / 100) * 50 : pm10 <= 254 ? 100 + ((pm10 - 154) / 100) * 50 : pm10 <= 354 ? 150 + ((pm10 - 254) / 100) * 50 : pm10 <= 424 ? 200 + ((pm10 - 354) / 70) * 100 : 300;

    const aqi = Math.round(Math.max(pm25AQI, pm10AQI, (no2 / 100) * 100, (so2 / 75) * 100, (o3 / 100) * 100, (co / 15) * 300));

    readings.push({
      id: `reading-${cityId}-${dateStr}`,
      cityId,
      date: dateStr,
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm10 * 10) / 10,
      no2: Math.round(no2 * 10) / 10,
      so2: Math.round(so2 * 10) / 10,
      o3: Math.round(o3 * 10) / 10,
      co: Math.round(co * 100) / 100,
      aqi,
      aqiCategory: getAQICategory(aqi),
    });
  }

  return readings;
}

export const airQualityReadings: AirQualityReading[] = cities.flatMap(city =>
  generateReadingsForCity(city.id, city.name)
);

export const aqiCategoryColors: Record<string, string> = {
  'Good': '#00e400',
  'Moderate': '#ffff00',
  'Unhealthy for Sensitive Groups': '#ff7e00',
  'Unhealthy': '#ff0000',
  'Very Unhealthy': '#8f3f97',
  'Hazardous': '#7e0023',
};

export const pollutantInfo = {
  pm25: { name: 'PM2.5', unit: 'µg/m³', description: 'Fine particulate matter' },
  pm10: { name: 'PM10', unit: 'µg/m³', description: 'Coarse particulate matter' },
  no2: { name: 'NO₂', unit: 'µg/m³', description: 'Nitrogen dioxide' },
  so2: { name: 'SO₂', unit: 'µg/m³', description: 'Sulfur dioxide' },
  o3: { name: 'O₃', unit: 'µg/m³', description: 'Ozone' },
  co: { name: 'CO', unit: 'mg/m³', description: 'Carbon monoxide' },
};
