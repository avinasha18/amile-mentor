import React, { useEffect, useMemo } from 'react';
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/Login";
import UserRegisterFlow from "./components/Register";
import { ThemeProvider } from "./context/ThemeContext";
import { setAuthToken } from "./hooks/golbalAuth";
import PageNotFound from "./components/noinfopage";
import { ForgotPassword } from "./components/forgotPassword";
import { ResetPassword } from "./components/resetPassword";
import { ResendVerification } from "./components/resendVerification";
import ReportIncident from "./components/reportIncident";
import MentorRouteManagement from "./mentor-components/MentorRouteManagement";
import { VerifyMentor } from './components/verifyAccount/verifyMentor';
import socket from './services/socket/socket';

function App() {
  const islogin = useSelector((state) => state.auth.token);
  setAuthToken(islogin);
  const userId = useSelector((state) => state.auth.mentorData?._id);
  const memoizedUserId = useMemo(() => userId, [userId]);
  useEffect(() => {
    if (islogin && userId) {
      socket.on('connect', () => {
        socket.emit('joinChat', { userId: memoizedUserId });
        console.log(`Emitted joinChat for User ID: ${memoizedUserId} on socket connect`);
      });
    }
  
    return () => {
      socket.off('connect');
    };
  }, [islogin, memoizedUserId]);



  return (
    <ThemeProvider>
      <Routes>
        <Route path="/mentor/verifyaccount" element={<VerifyMentor />} />

        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/resendverify" element={<ResendVerification />} />
        <Route path="/report" element={<ReportIncident />} />

        <Route
          path="/signup"
          element={!islogin ? <UserRegisterFlow /> : <PageNotFound />}
        />
        <Route
          path="/login"
          element={!islogin ? <Login /> : <PageNotFound />}
        />
        <Route path="/*" element={<MentorRouteManagement islogin={islogin}/>} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;