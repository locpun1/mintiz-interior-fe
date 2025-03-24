import { IUser } from '@/types/user';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface InitState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  profile: IUser | null;
}

const initialState: InitState = {
  isInitialized: false,
  isAuthenticated: false,
  profile: null,
};

const authSlice = createSlice({
  name: '@user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<InitState['profile']>) {
      state.profile = action.payload || null;
    },
    setIsAuth(state, action: PayloadAction<InitState['isAuthenticated']>) {
      state.isAuthenticated = action.payload;
    },
    setInitApp(state) {
      state.isInitialized = true;
    },
  },
});

export const { setInitApp, setIsAuth, setProfile } = authSlice.actions;

export default authSlice.reducer;
