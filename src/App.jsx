import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import UserDashboard from './pages/user/UserDashboard';
import ItemList from './pages/user/item/ItemsPage';
import ItemDetailPage from './pages/user/item/itemDetailPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import UsersAdmin from './pages/admin/UsersAdmin';
import Products from './pages/admin/Products';

import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items"
        element={
          <ProtectedRoute role="user">
            <ItemList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:itemId"
        element={
          <ProtectedRoute role="user">
            <ItemDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="products" element={<Products />} />
      </Route>

      {/* Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
