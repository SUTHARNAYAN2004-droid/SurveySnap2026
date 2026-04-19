// AppRoutes.jsx - Poori application ki routing yahan define hoti hai
// React Router v6 ka createBrowserRouter use kiya gaya hai
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SetupProfile from "../pages/auth/SetupProfile";
import ContactUs from "../pages/ContactUs";
import ForgotPassword from "../pages/auth/ForgotPassword";

// User section ke liye layout (navbar ke saath)
import UserLayout from "../Component/layout/UserLayout";
import Dashboard from "../pages/user/Dashboard";
import CreateSurvey from "../pages/user/CreateSurvey";
import SurveyAnalytics from "../pages/user/SurveyAnalytics";

// Respondent (survey bharne wala)
import TakeSurvey from "../pages/respondent/TakeSurvey";

// Admin section ke liye layout (sidebar ke saath)
import AdminLayout from "../Component/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageSurveys from "../pages/admin/ManageSurveys";
import TemplateDetails from "../pages/TemplateDetails";
import Templates from "../pages/Templates";
import ViewSurvey from "../pages/user/ViewSurvey";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminGuard from "../Component/admin/AdminGuard";

const router = createBrowserRouter([

  // Public routes - koi bhi access kar sakta hai
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/setup-profile", element: <SetupProfile /> },
  { path: "/contact", element: <ContactUs /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // Survey create karne ka page (UserLayout ke bahar hai abhi)
  { path: "/CreateSurvey", element: <CreateSurvey /> },

  // Template routes
  { path: "/templates", element: <Templates /> },
  { path: "/template/:name", element: <TemplateDetails /> },

  // User protected routes - UserLayout (navbar) ke andar render hote hain
  {
    element: <UserLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/view-survey/:id", element: <ViewSurvey /> }, // Specific survey dekhna
      { path: "/analytics", element: <SurveyAnalytics /> },
    ],
  },

  // Survey fill karne ka page (respondent ke liye)
  { path: "/survey/:id", element: <TakeSurvey /> },

  // Admin login - alag page, koi navbar nahi
  { path: "/admin/login", element: <AdminLogin /> },

  // Admin protected routes - AdminGuard check karega adminToken
  {
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/users", element: <ManageUsers /> },
          { path: "/admin/surveys", element: <ManageSurveys /> },
        ],
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
