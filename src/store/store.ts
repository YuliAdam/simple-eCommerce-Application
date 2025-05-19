import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '@store/slices/registrationSlice';
import errorReducer from '@store/slices/errorSlice';
import authSlice from '@/store/slices/authSlice';

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    error: errorReducer,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
