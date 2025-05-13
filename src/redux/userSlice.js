import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading:false,
    error:false
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = false;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
        state.user = null;
        state.loading = false;
        state.error = false;
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;