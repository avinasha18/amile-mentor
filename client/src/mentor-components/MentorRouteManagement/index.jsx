import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import MentorHome from '../Home';
import MentorCourses from '../Courses';
import MentorCourseDetails from '../Courses/CourseDetails';
import InterviewApp from '../Mock-Interview/InterviewApp';
import MentorNavbar from '../Navbar/Navbar';
import MentorSidebar from '../Sidebar';
import MentorProfile from '../Profile/Profile';
import Dashboard from '../Dashboard';
import TanStackTable from '../StudentList/TanStackTable';
import StartChat from "../../components/CompanyStartChart";

const ProtectedRoute = ({ isLogin, children, nextPath }) => {
  if (!isLogin) {
    return <Navigate to={`/login?nextpath=${nextPath}`} replace />;
  }
  return children;
};

const MentorRouteManagement = ({ islogin }) => {
  const location = useLocation();

  return (
    <div className="flex flex-row h-screen overflow-hidden bg-gray-900 text-gray-100">
      <MentorSidebar />
      <div className={`h-screen flex flex-1 overflow-auto no-scrollbar`}>
        <div className="w-full">
          <MentorNavbar islogin={islogin}/>
          <div className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <MentorHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <MentorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <MentorCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aimock"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <InterviewApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <StartChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <TanStackTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute isLogin={islogin} nextPath={location.pathname}>
                    <MentorCourseDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRouteManagement;
