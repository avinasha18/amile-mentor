import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null,
    mentor: Cookies.get('mentor') || null,
    mentorData : JSON.parse( Cookies.get('mentorData') || null),
   
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token ,user} = action.payload;
      state.token = token;
      state.mentor = user.username;
      state.mentorData = user;
      Cookies.set('mentorData',JSON.stringify(user), { expires: action.payload?.cookieExpires || 7}); 
      Cookies.set('token', token, { expires: action.payload.cookieExpires || 1});
      Cookies.set('mentor', user.username, { expires: action.payload.cookieExpires || 1}); 
      Cookies.set('mentorId', user._id, { expires: action.payload.cookieExpires || 1}); 

    },
    logout: (state) => {
      state.token = null;
      state.mentor = null;
      state.mentorData = null;
      Cookies.remove('token');
      Cookies.remove('mentor');
      Cookies.remove('mentorData');
      Cookies.remove('mentorId');

    },
    setmentorData: (state, action) => {
      state.mentorData = action.payload;
      Cookies.set('mentorData',JSON.stringify(action.payload), { expires: action.payload?.cookieExpires || 7}); 

    },
  },
});

export const { loginSuccess, logout, setmentorData } = authSlice.actions;
export default authSlice.reducer;
