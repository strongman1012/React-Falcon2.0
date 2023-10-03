import { createSlice } from '@reduxjs/toolkit';

import keys from '../../utils/keys';
import { isEmpty } from '../../helpers/utils';

const { AUTH_TOKEN } = keys;

const initialState = { isAuthenticated: false, user: null };

/* Store auth state */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, { payload }) {
      return { ...state, isAuthenticated: !isEmpty(payload), user: payload };
    },
    logoutUser() {
      /* Remove 'AUTH_TOKEN' from localStorage */
      localStorage.removeItem(AUTH_TOKEN);
      /* Set isAuthenticated: false & user: null */
      return { ...initialState };
    }
  }
});

export const { setCurrentUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
