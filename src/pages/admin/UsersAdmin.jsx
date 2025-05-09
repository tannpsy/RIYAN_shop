import { useState } from 'react';
import '../../css/UsersAdmin.css'; // Opsional, untuk styling tambahan

export default function UsersAdmin() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'User' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Admin' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
  ]);

  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
    // Tambahkan logika modal/form edit di sini
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="dashboard-card">
      <h2>User Management</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
