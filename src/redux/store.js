import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import settingsSlice from './slices/settingsSlice';
import viewlistSlice from './slices/viewlistSlice';
import currentDataSlice from './slices/currentDataSlice';

const rootReducer = combineReducers({
  currentData: currentDataSlice,
  viewlistState: viewlistSlice,
  settings: settingsSlice,
  theme: themeSlice,
  auth: authSlice
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    });
  }
});
export default store;
