import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('mentortoken') || null,
    mentor: Cookies.get('mentor') || null,
    mentorData: (() => {
      const mentorDataCookie = Cookies.get('mentorData');
      if (mentorDataCookie) {
        try {
          return JSON.parse(mentorDataCookie) || {};
        } catch (e) {
          console.error("Error parsing mentorData cookie:", e);
          return {};
        }
      }
      return {};
    })(),
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.mentor = user.username;
      Cookies.set('mentortoken', token, { expires: action.payload.cookieExpires || 1 });
      Cookies.set('mentor', user.username, { expires: action.payload.cookieExpires || 1 });
      Cookies.set('mentorData', JSON.stringify(user), { expires: action.payload.cookieExpires || 1 });
      Cookies.set('mentorId', user._id, { expires: action.payload.cookieExpires || 1 });
    },
    logout: (state) => {
      state.token = null;
      state.mentor = null;
      state.mentorData = {};
      Cookies.remove('mentortoken');
      Cookies.remove('mentor');
      Cookies.remove('mentorData');
      Cookies.remove('mentorId');
    },
    setmentorData: (state, action) => {
      if (action.payload && typeof action.payload === 'object') {
        state.mentorData = action.payload.username || {}; // Accessing username safely
        Cookies.set('mentorData', JSON.stringify(action.payload), { expires: action.payload?.cookieExpires || 7 });
      } else {
        console.error('setmentorData received undefined or invalid payload:', action.payload);
      }
    },

  },
});

export const { loginSuccess, logout, setmentorData } = authSlice.actions;
export default authSlice.reducer;
