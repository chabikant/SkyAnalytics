
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unit } from '../../types';

interface SettingsState {
  unit: Unit;
}

const initialState: SettingsState = {
  unit: (localStorage.getItem('temp_unit') as Unit) || Unit.CELSIUS,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === Unit.CELSIUS ? Unit.FAHRENHEIT : Unit.CELSIUS;
      localStorage.setItem('temp_unit', state.unit);
    },
  },
});

export const { toggleUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
