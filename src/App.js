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
function App() {
  return (
    <MainLayout>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/my-learning" element={
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          }
          />
          <Route
            path="/payment/:id"
            element={<Payment />}
          />

          <Route
            path="/payment-success/:id"
            element={<PaymentSuccess />}
          />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          />
          <Route
            path="/learning/:id"
            element={
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PageTransition>
    </MainLayout>
  );
}

export default App;