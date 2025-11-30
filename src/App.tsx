import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// Layout
import { Layout } from "@/components/layout/Layout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import AttendanceMark from "./pages/employee/AttendanceMark";
import History from "./pages/employee/History";

// Manager Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import Employees from "./pages/manager/Employees";
import TeamCalendar from "./pages/manager/TeamCalendar";
import Reports from "./pages/manager/Reports";

// Shared Pages
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  // If not authenticated, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but user data hasn't loaded, prevent rendering protected UI
  // and force a re-auth flow to avoid role/permission glitches.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route has allowedRoles and the user's role is not included, redirect to their proper dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};


const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            {/* Employee Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute allowedRoles={['employee']}><AttendanceMark /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['employee']}><History /></ProtectedRoute>} />
            
            {/* Manager Routes */}
            <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/employees" element={<ProtectedRoute allowedRoles={['manager']}><Employees /></ProtectedRoute>} />
            <Route path="/manager/calendar" element={<ProtectedRoute allowedRoles={['manager']}><TeamCalendar /></ProtectedRoute>} />
            <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['manager']}><Reports /></ProtectedRoute>} />
            
            {/* Shared Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
