import { configureStore } from '@reduxjs/toolkit';
import selectedCoinsReducer from './selectedCoinsSlice';

export const store = configureStore({
  reducer: {
    selectedCoins: selectedCoinsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
