import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import RegisterPage from './pages/auth/RegisterPage';
import UsersAdmin from './pages/admin/UsersAdmin';
import AdminHome from './pages/admin/AdminHome';

// Authentication component to redirect already logged in users
const AuthRoute = ({ children }) => {
  const userRole = localStorage.getItem('role');
  
  // If already logged in, redirect based on role
  if (userRole) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  
  // Not logged in, show the auth page
  return children;
};

// Protected route component to check authentication and role
const ProtectedRoute = ({ children, role }) => {
  // Check if user is logged in by looking for role in localStorage
  const userRole = localStorage.getItem('role');
  const isAuthenticated = !!userRole;
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but wrong role, redirect to appropriate page
  if (role && userRole !== role) {
    // Send admin users to admin dashboard
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // Send regular users to user dashboard
    return <Navigate to="/home" replace />;
  }
  
  // If authenticated and has correct role, render the children
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!userRole);
  }, []);
  
  const handleLogin = (role) => {
    // Save role to localStorage
    localStorage.setItem('role', role);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    // Remove role from localStorage
    localStorage.removeItem('role');
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      {/* Public route - accessible to all */}
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      
      {/* Auth routes - redirect to appropriate dashboard if already logged in */}
      <Route path="/login" element={
        <AuthRoute>
          <LoginPage onLogin={handleLogin} />
        </AuthRoute>
      } />
      <Route path="/register" element={
        <AuthRoute>
          <RegisterPage onRegister={handleLogin} />
        </AuthRoute>
      } />
      
      {/* Protected routes - require authentication with specific role */}
      <Route path="/home" element={
        <ProtectedRoute role="user">
          <UserDashboard onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminDashboard onLogout={handleLogout} />
        </ProtectedRoute>
      }>
        <Route index element={<AdminHome />} />
        <Route path="/admin/users" element={<UsersAdmin />} />
      </Route>
      
      {/* Fallback for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;