import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface DialogState {
  values: {
    isOpen: boolean;
    value: string;
  };
}

const initialState: DialogState = {
  values: {
    isOpen: false,
    value: 'error',
  },
};

export const errorSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    toggleDialog(state, action: PayloadAction<boolean>) {
      state.values.isOpen = action.payload;
    },
    setValue(state, action: PayloadAction<string>) {
      state.values.value = action.payload;
    },
  },
});

export const { toggleDialog, setValue } = errorSlice.actions;

export default errorSlice.reducer;
