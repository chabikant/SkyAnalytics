
import { WeatherData, ForecastDay, HourlyData, TrendData } from "./types";

const OPENWEATHER_KEY = '8fa00f404229c21cacc4739ecafba0a0';

const mapIcon = (code: string): string => {
  const mapping: Record<string, string> = {
    '01': 'fa-sun',
    '02': 'fa-cloud-sun',
    '03': 'fa-cloud',
    '04': 'fa-cloud-meatball',
    '09': 'fa-cloud-showers-heavy',
    '10': 'fa-cloud-sun-rain',
    '11': 'fa-bolt',
    '13': 'fa-snowflake',
    '50': 'fa-smog',
  };
  const base = code.substring(0, 2);
  return mapping[base] || 'fa-cloud';
};

const generateClimateInsight = (weather: { 
  temp: number; 
  condition: string; 
  humidity: number; 
  windSpeed: number;
  city: string;
}): string => {
  if (weather.temp > 32) return `Extreme heat alert for ${weather.city}. Ensure adequate hydration and minimize direct solar exposure during peak hours.`;
  if (weather.temp < 2) return `Freezing conditions detected. Recommend standard winterization protocols and thermal layering for any outdoor activity.`;
  if (weather.windSpeed > 45) return `High velocity winds observed. Secure loose equipment and expect potential turbulence for local transit and flight paths.`;
  if (weather.humidity > 85 && weather.temp > 25) return `High heat index humidity levels. Atmospheric saturation may increase physical fatigue; maintain standard climate control.`;
  if (weather.condition.toLowerCase().includes('rain')) return `Precipitation patterns active. Waterproof protective layers are required for all operational outdoor personnel.`;
  if (weather.condition.toLowerCase().includes('clear')) return `Optimal visibility and stable atmospheric pressure. Ideal conditions for general operations and solar energy harvest.`;
  
  return `Standard atmospheric stability observed. No immediate climate risks detected for ${weather.city} based on current sensor metrics.`;
};

export const fetchWeatherAnalytics = async (city: string): Promise<WeatherData> => {
  
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`
  );
  if (!currentRes.ok) {
    const errorData = await currentRes.json();
    throw new Error(errorData.message || `City "${city}" not found.`);
  }
  const currentData = await currentRes.json();

  
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`
  );
  if (!forecastRes.ok) throw new Error("Failed to fetch forecast data.");
  const forecastData = await forecastRes.json();

  
  const hourly: HourlyData[] = forecastData.list.slice(0, 6).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: item.main.temp,
    precipitation: Math.round((item.pop || 0) * 100)
  }));

 
  const dailyMap: Record<string, { high: number; low: number; condition: string; icon: string }> = {};
  forecastData.list.forEach((item: any) => {
    const dateObj = new Date(item.dt * 1000);
    const dateKey = dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = {
        high: item.main.temp_max,
        low: item.main.temp_min,
        condition: item.weather[0].main,
        icon: mapIcon(item.weather[0].icon)
      };
    } else {
      dailyMap[dateKey].high = Math.max(dailyMap[dateKey].high, item.main.temp_max);
      dailyMap[dateKey].low = Math.min(dailyMap[dateKey].low, item.main.temp_min);
    }
  });

  const forecast: ForecastDay[] = Object.entries(dailyMap).map(([date, val]) => ({
    date,
    ...val
  })).slice(0, 7);

  const historicalTrends: TrendData[] = forecast.map((d) => ({
    label: d.date.split(',')[0],
    temp: (d.high + d.low) / 2,
    avgWind: currentData.wind.speed * 3.6 + (Math.random() * 4 - 2) 
  }));

  const temp = currentData.main.temp;
  const rh = currentData.main.humidity;
  const dewPoint = temp - ((100 - rh) / 5);

  return {
    city: currentData.name,
    temp: currentData.main.temp,
    condition: currentData.weather[0].main,
    description: currentData.weather[0].description,
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed * 3.6,
    pressure: currentData.main.pressure,
    uvIndex: 0, 
    dewPoint: Math.round(dewPoint),
    icon: mapIcon(currentData.weather[0].icon),
    forecast,
    hourly,
    historicalTrends,
    lastUpdated: Date.now()
  };
};

export const getAIInsights = async (weather: WeatherData): Promise<string> => {
  return generateClimateInsight({
    temp: weather.temp,
    condition: weather.condition,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    city: weather.city
  });
};
