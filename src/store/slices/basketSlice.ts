import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalItems: 0,
  totalPrice: 0,
};

const basketSlice = createSlice({
  name: 'basketSlice',
  initialState,
  reducers: {
    setTotalItems(state, action: PayloadAction<number>) {
      state.totalItems = action.payload;
    },
    changeTotalItems(state, action: PayloadAction<number>) {
      state.totalItems += action.payload;
    },
    setTotalPrice(state, action: PayloadAction<number>) {
      state.totalPrice = action.payload;
    },
  },
});

export const { setTotalItems, changeTotalItems, setTotalPrice } = basketSlice.actions;
export default basketSlice.reducer;
