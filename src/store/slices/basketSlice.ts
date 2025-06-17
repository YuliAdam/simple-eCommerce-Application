import type { ItemsIdObject } from '@/interfaces/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface BasketState {
  totalItems: number;
  totalPrice: number;
  itemsId: ItemsIdObject[];
}

const initialState: BasketState = {
  totalItems: 0,
  totalPrice: 0,
  itemsId: [],
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
    setItemsId(state, action: PayloadAction<ItemsIdObject[]>) {
      state.itemsId = action.payload.slice();
    },
    addItemsId(state, action: PayloadAction<ItemsIdObject>) {
      state.itemsId.push(action.payload);
    },
    removeItemId(state, action: PayloadAction<ItemsIdObject>) {
      console.log(
        state.itemsId.filter(
          item => item.id !== action.payload.id && item.variantId !== action.payload.variantId,
        ),
      );
      console.log(state.itemsId);
      console.log(action.payload);
      state.itemsId = state.itemsId.filter(
        item => item.id !== action.payload.id && item.variantId !== action.payload.variantId,
      );
    },
  },
});

export const {
  setTotalItems,
  changeTotalItems,
  setTotalPrice,
  setItemsId,
  addItemsId,
  removeItemId,
} = basketSlice.actions;
export default basketSlice.reducer;
