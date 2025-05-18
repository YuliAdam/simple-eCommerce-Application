import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '@store/slices/registrationSlice';
import errorReducer from '@store/slices/errorSlice';

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    error: errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
