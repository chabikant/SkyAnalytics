
export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  dewPoint: number;
  icon: string;
  forecast: ForecastDay[];
  hourly: HourlyData[];
  historicalTrends: TrendData[];
  lastUpdated: number;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface HourlyData {
  time: string;
  temp: number;
  precipitation: number;
}

export interface TrendData {
  label: string;
  temp: number;
  avgWind: number;
}

export enum Unit {
  CELSIUS = 'C',
  FAHRENHEIT = 'F'
}

export interface AppState {
  favorites: string[];
  unit: Unit;
  selectedCity: WeatherData | null;
  cachedData: Record<string, WeatherData>;
}
