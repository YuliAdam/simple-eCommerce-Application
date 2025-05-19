import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface ErrorState {
  values: {
    isError: boolean;
    value: string;
  };
}

const initialState: ErrorState = {
  values: {
    isError: true,
    value: '',
  },
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    toggleError(state, action: PayloadAction<boolean>) {
      state.values.isError = action.payload;
    },
    setValue(state, action: PayloadAction<string>) {
      state.values.value = action.payload;
    },
    resetErrorState(state) {
      state.values.value = 'No errors';
      state = initialState;
    },
  },
});

export const { toggleError, setValue, resetErrorState } = errorSlice.actions;

export default errorSlice.reducer;
