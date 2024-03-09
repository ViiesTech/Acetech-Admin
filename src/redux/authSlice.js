import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      // console.log('action', action.payload);
    },

    clearToken : (state, action) => {
      state.token = ''
    }
  },
});


export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
