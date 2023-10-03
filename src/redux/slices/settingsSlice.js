import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

/* Store overall app settings mostly provided by api */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(settings, { payload }) {
      return { ...settings, ...payload };
    }
  }
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
