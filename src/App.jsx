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
import Reviews from './pages/admin/Reviews';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
        <Route path="reviews" element={<Reviews />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
