import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const users = {
  user: { username: 'user', password: '1234', role: 'user' },
  admin: { username: 'admin', password: 'admin', role: 'admin' },
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users[username];
    if (user && user.password === password) {
      localStorage.setItem('role', user.role);
      navigate(user.role === 'admin' ? '/admin' : '/user');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
