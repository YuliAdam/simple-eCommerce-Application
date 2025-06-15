import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface DialogState {
  values: {
    isOpen: boolean;
    value: string;
    isCodeDialog: boolean;
    codeValue: string;
    isValidCode: boolean;
  };
}

const initialState: DialogState = {
  values: {
    isOpen: false,
    value: 'error',
    isCodeDialog: false,
    codeValue: '',
    isValidCode: false,
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
    setCode(state, action: PayloadAction<string>) {
      state.values.codeValue = action.payload;
    },
    toggleCodeForm(state, action: PayloadAction<boolean>) {
      if (state.values.isCodeDialog !== action.payload) state.values.isCodeDialog = action.payload;
    },
    validationCode(state, action: PayloadAction<boolean>) {
      if (state.values.isValidCode !== action.payload) state.values.isValidCode = action.payload;
    },
  },
});

export const { toggleDialog, setDialogText, setCode, toggleCodeForm, validationCode } =
  errorSlice.actions;

export default errorSlice.reducer;
