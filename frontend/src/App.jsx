import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import StudentBenefitPage from "./pages/student/home/benefit";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import PaypalPaymentCancelPage from "./pages/student/payment-cancel";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import QuizPage from "./pages/student/QuizPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminLayout from "./components/admin-view/layout";
import ChatPage from "./pages/chat/chatPage";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <RouteGuard
            element={<AdminDashboard />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin/users"
        element={
          <RouteGuard
            element={<AdminUsers />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin/courses"
        element={
          <RouteGuard
            element={<AdminCourses />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin/orders"
        element={
          <RouteGuard
            element={<AdminOrders />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RouteGuard
            element={<AdminAnalytics />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="Benefit" element={<StudentBenefitPage />} />

        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route
          path="course/details/:id"
          element={<StudentViewCourseDetailsPage />}
        />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="payment-cancel" element={<PaypalPaymentCancelPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route
          path="course-progress/:id"
          element={<StudentViewCourseProgressPage />}
        />
      </Route>

      {/* QUIZ ROUTE */}
      <Route
        path="/quiz"
        element={
          <RouteGuard
            element={<QuizPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route path="*" element={<NotFoundPage />} />

      {/* STUDENT → TEACHER CHAT */}
      <Route
        path="/chat"
        element={
          <RouteGuard
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<ChatPage />}
          />
        }
      />

      {/* TEACHER → STUDENT CHAT */}
      {/* <Route
        path="/instructor/chat/:courseId/:otherUserId"
        element={
          <RouteGuard
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<Chat />}
          /> */}
      {/* }
      /> */}
    </Routes>
  );
}

export default App;
