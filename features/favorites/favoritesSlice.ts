
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[];
}

const initialState: FavoritesState = {
  cities: JSON.parse(localStorage.getItem('fav_cities') || '[]'),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      if (state.cities.includes(city)) {
        state.cities = state.cities.filter(c => c !== city);
      } else {
        state.cities.push(city);
      }
      localStorage.setItem('fav_cities', JSON.stringify(state.cities));
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
        localStorage.setItem('fav_cities', JSON.stringify(state.cities));
      }
    }
  },
});

export const { toggleFavorite, addFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
