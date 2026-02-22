import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import ApplyPartner from "../pages/Partner/ApplyPartner";
import PartnerBookings from "../pages/Partner/PartnerBookings";
import PartnersList from "../pages/Booking/PartnersList";
import MyBookings from "../pages/Booking/MyBookings";
import Wallet from "../pages/Wallet/Wallet";
import PartnerApproval from "../pages/Admin/PartnerApproval";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ChatRoom from "../pages/Chat/ChatRoom";
import ChatRouteProtection from "../components/ChatRouteProtection";
import ProtectedRoute from "./ProtectedRoute";
import { UserOnlyRoute, AdminOnlyRoute } from "./RoleBasedRoutes";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/admin/partner-approval",
        element: (
          <ProtectedRoute>
            <AdminOnlyRoute>
              <PartnerApproval />
            </AdminOnlyRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminOnlyRoute>
              <AdminDashboard />
            </AdminOnlyRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/partners",
        element: (
          <ProtectedRoute>
            <UserOnlyRoute>
              <PartnersList />
            </UserOnlyRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/wallet",
        element: (
          <ProtectedRoute>
            <UserOnlyRoute>
              <Wallet />
            </UserOnlyRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-bookings",
        element: (
          <ProtectedRoute>
            <UserOnlyRoute>
              <MyBookings />
            </UserOnlyRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/partner/bookings",
        element: (
          <ProtectedRoute>
            <PartnerBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/apply-partner",
        element: (
          <ProtectedRoute>
            <UserOnlyRoute>
              <ApplyPartner />
            </UserOnlyRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat/:bookingId",
        element: (
          <ProtectedRoute>
            <ChatRouteProtection>
              <ChatRoom />
            </ChatRouteProtection>
          </ProtectedRoute>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

export default router;
