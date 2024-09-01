import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { act } from 'react';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null,
    user: Cookies.get('user') || null,
    userData: (() => {
      const userDataCookie = Cookies.get('userData');
      if (userDataCookie) {
        try {
          return JSON.parse(userDataCookie) || {};
        } catch (e) {
          console.error("Error parsing userData cookie:", e);
          return {};
        }
      }
      return {};
    })(),
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token ,user} = action.payload;
      console.log(action.payload)
      state.token = token;
      state.user = user.username;
      Cookies.set('token', token, { expires: action.payload.cookieExpires || 1});
      Cookies.set('user', user.username, { expires: action.payload.cookieExpires || 1}); 
      Cookies.set('userData', JSON.stringify(user), { expires: action.payload.cookieExpires || 1}); 

      Cookies.set('userId', user._id, { expires: action.payload.cookieExpires || 1}); 

    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userData = {};
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('userData');
    },
    setUserData: (state, action) => {
      state.userData = action.payload.user;
      console.log(action.payload,'in set user data')
      Cookies.set('userData',JSON.stringify(action.payload), { expires: action.payload?.cookieExpires || 7}); 

    },
  },
});

export const { loginSuccess, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;
