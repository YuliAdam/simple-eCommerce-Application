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
      if (state.values.isOpen !== action.payload) state.values.isOpen = action.payload;
    },
    setDialogText(state, action: PayloadAction<string>) {
      state.values.value = action.payload;
    },
  },
});

export const { toggleDialog, setDialogText } = errorSlice.actions;

export default errorSlice.reducer;
