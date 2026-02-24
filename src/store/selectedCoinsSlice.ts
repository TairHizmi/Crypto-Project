import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectedCoin {
  id: string;
  symbol: string;
}

interface SelectedCoinsState {
  coins: SelectedCoin[];
}

const loadFromStorage = (): SelectedCoin[] => {
  const data = localStorage.getItem('selectedCoins');
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    // Ensure we only load objects that have both id and symbol
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && typeof item === 'object' && item.id && item.symbol);
    }
    return [];
  } catch {
    return [];
  }
};

const initialState: SelectedCoinsState = {
  coins: loadFromStorage(),
};

const selectedCoinsSlice = createSlice({
  name: 'selectedCoins',
  initialState,
  reducers: {
    addCoin(state, action: PayloadAction<SelectedCoin>) {
      if (state.coins.some(c => c.id === action.payload.id)) return;
      if (state.coins.length >= 5) return;
      state.coins.push(action.payload);
      localStorage.setItem('selectedCoins', JSON.stringify(state.coins));
    },
    removeCoin(state, action: PayloadAction<string>) {
      state.coins = state.coins.filter((c) => c.id !== action.payload);
      localStorage.setItem('selectedCoins', JSON.stringify(state.coins));
    },
    setCoins(state, action: PayloadAction<SelectedCoin[]>) {
      state.coins = action.payload;
      localStorage.setItem('selectedCoins', JSON.stringify(state.coins));
    },
  },
});

export const { addCoin, removeCoin, setCoins } = selectedCoinsSlice.actions;
export default selectedCoinsSlice.reducer;
