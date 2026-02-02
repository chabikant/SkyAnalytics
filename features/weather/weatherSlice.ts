
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData } from '../../types';
import { fetchWeatherAnalytics, getAIInsights } from '../../weatherService';

interface WeatherState {
  cachedData: Record<string, WeatherData>;
  insights: Record<string, string>;
  selectedCity: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  cachedData: {},
  insights: {},
  selectedCity: null,
  loading: false,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string) => {
    const data = await fetchWeatherAnalytics(city);
    const insight = await getAIInsights(data);
    return { data, insight };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedCity: (state, action: PayloadAction<WeatherData | null>) => {
      state.selectedCity = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors when starting a new search
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.cachedData[action.payload.data.city] = action.payload.data;
        state.insights[action.payload.data.city] = action.payload.insight;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data. Please check your connection or city name.';
      });
  },
});

export const { setSelectedCity, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
