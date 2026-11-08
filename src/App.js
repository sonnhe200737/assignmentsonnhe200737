import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./layouts/MainLayout";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";
import MyLearning from "./pages/MyLearning";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Learning from "./pages/Learning";

import Dashboard from "./pages/admin/Dashboard";
import CourseManagement from "./pages/admin/CourseManagement";
import LessonManagement from "./pages/admin/LessonManagement";
import UserManagement from "./pages/admin/UserManagement";
import EnrollmentManagement from "./pages/admin/EnrollmentManagement";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <MainLayout>

      <PageTransition>

        <Routes>

          {/* Public */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/courses"
            element={<Courses />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetail />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* Student */}

          <Route
            path="/my-learning"
            element={
              <ProtectedRoute role="student">
                <MyLearning />
              </ProtectedRoute>
            }
          />


          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute role="student">
                <Payment />
              </ProtectedRoute>
            }
          />


          <Route
            path="/payment-success/:id"
            element={
              <ProtectedRoute role="student">
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />


          <Route
            path="/learning/:id"
            element={
              <ProtectedRoute role="student">
                <Learning />
              </ProtectedRoute>
            }
          />


          {/* Common */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* Admin */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* Not found */}

          <Route
            path="*"
            element={<NotFound />}
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute role="admin">
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lessons"
            element={
              <ProtectedRoute role="admin">
                <LessonManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enrollments"
            element={
              <ProtectedRoute role="admin">
                <EnrollmentManagement />
              </ProtectedRoute>
            }
          />
        </Routes>


      </PageTransition>

    </MainLayout>
  );
}

export default App;