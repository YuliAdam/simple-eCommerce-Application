import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthorized: false,
  authToken: null,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthorized = true;
      state.authToken = action.payload;
    },
    logout(state) {
      state.isAuthorized = false;
      state.authToken = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
