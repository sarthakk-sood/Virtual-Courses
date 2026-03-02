import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import getCurrentUser from "./customHooks/getCurrentUser";
import { useSelector } from "react-redux";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCourses from "./pages/Educator/CreateCourses";
import getCreatorCourse from "./customHooks/getCreatorCourse";
import EditCourse from "./pages/Educator/EditCourse";
import getPublishedCourse from "./customHooks/getPublishedCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from "./components/ScrollToTop";
import ViewLectures from "./pages/ViewLectures";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import getAllReviews from "./customHooks/getAllReviews";
import SearchWithAi from "./pages/SearchWithAi";
export const serverUrl = import.meta.env.VITE_SERVER_URL;
function App() {
  getCurrentUser();
  getCreatorCourse();
  getPublishedCourse();
  getAllReviews();
  const { userData, isLoading } = useSelector((state) => state.user);

  if (isLoading) return null;

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/forget"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to={"/signup"} />}
        />

        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to={userData ? "/" : "/signup"} />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to={userData ? "/" : "/signup"} />
            )
          }
        />
        <Route
          path="/createcourse"
          element={
            userData?.role === "educator" ? (
              <CreateCourses />
            ) : (
              <Navigate to={userData ? "/" : "/signup"} />
            )
          }
        />
        <Route
          path="/editcourse/:courseId"
          element={
            userData?.role === "educator" ? (
              <EditCourse />
            ) : (
              <Navigate to={userData ? "/" : "/signup"} />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to={userData ? "/" : "/signup"} />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to={userData ? "/" : "/signup"} />
            )
          }
        />
        <Route
          path="/viewcourse/:courseId"
          element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLectures /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/mycourses"
          element={
            userData ? <MyEnrolledCourses /> : <Navigate to={"/signup"} />
          }
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/search"
          element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />}
        />
      </Routes>
    </>
  );
}

export default App;
