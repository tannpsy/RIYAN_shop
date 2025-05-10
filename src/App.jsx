import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import RegisterPage from './pages/auth/RegisterPage';
import UsersAdmin from './pages/admin/UsersAdmin';
import AdminHome from './pages/admin/AdminHome';
import Products from './pages/admin/Products';
import ItemList from './pages/user/item/ItemsPage';
import ItemDetailPage from './pages/user/item/itemDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/" element={<HomePage />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/home" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/home" element={<UserDashboard />} />
      <Route path="/items" element={<ItemList />} />
      <Route path="/items/:itemId" element={<ItemDetailPage />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<UsersAdmin />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
