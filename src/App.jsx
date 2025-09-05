
import AuditLogsPage from './pages/AuditLogsPage.jsx';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Navbar from './components/layout/Navbar.jsx';
import PrivateRoute from './components/layout/PrivateRoute.jsx';
import Toasts from './components/ui/Toast.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; 
import UserProfilePage from './pages/UserProfilePage.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import ToastProvider from './context/ToastProvider.jsx';
//import CreatorUsersPage from './pages/CreatorUsersPage.jsx';
//import ViewerUsersPage from './pages/ViewerUsersPage.jsx';

import HomeRedirect from './components/layout/HomeRedirect.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UsersPage from './pages/UsersPage.jsx';
import RolesPage from './pages/RolesPage.jsx';
import PermissionsPage from './pages/PermissionsPage.jsx';

import RequirePermission from './components/layout/RequirePermission.jsx';

function AppRoutes() {
  const { isAuthenticated, user, permissions = [] } = useAuth();

  const isAdmin = (user?.roles || []).includes('Admin');
  const hasSelfRead = permissions.includes('self.read');

  // default landing page after login
  const defaultRedirect = isAdmin ? '/dashboard' : hasSelfRead ? '/user-profile' : '/';

  return (
    <Routes>
      {/* Home redirect */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Public routes but red if airect already logged in */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={defaultRedirect} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={defaultRedirect} replace /> : <RegisterPage />}
      />

      {/* Profile */}
      <Route
        path="/user-profile"
        element={
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        }
      />

      {/* Admin-ish areas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute anyRole={['Admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <RequirePermission roles={['Admin']} anyOf={['users.read']}>
              <UsersPage />
            </RequirePermission>
          </PrivateRoute>
        }
      />

 

      <Route path="/forbidden" element={<div className="p-6">403 — Forbidden</div>} />

<Route
  path="/audit-logs"
  element={
    <ProtectedRoute anyRole={['Admin']}>
      <AuditLogsPage apiBaseUrl={import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ?? ''} />
    </ProtectedRoute>
  }
/>

      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <RequirePermission roles={['Admin']} anyOf={['roles.manage']}>
              <RolesPage />
            </RequirePermission>
          </PrivateRoute>
        }
      />

      <Route
        path="/permissions"
        element={
          <PrivateRoute>
            <RequirePermission roles={['Admin']} anyOf={['permissions.manage']}>
              <PermissionsPage />
            </RequirePermission>
          </PrivateRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<div className="p-6">404 — Not Found</div>} />
    </Routes>
    
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto p-4">
              <AppRoutes /> {/* ✅ extracted into separate function */}
            </main>
            <Toasts />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
