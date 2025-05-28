import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '@store/slices/registrationSlice';
import dialogReducer from '@/store/slices/dialogSlice';
import authReducer from '@/store/slices/authSlice';
import userReducer from '@/store/slices/userSlice';

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    dialog: dialogReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
