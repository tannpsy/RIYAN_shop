import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Ensure supabase is imported
import '../../css/UsersAdmin.css'; // Optional, for styling

export default function UsersAdmin({ setTotalUsers }) {
  const [users, setUsers] = useState([]);

  // Fetch data from the 'users' table
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users') // Fetch data from 'users' table
          .select('id, fullname, email, role'); // Select necessary columns

        if (error) {
          throw error;
        }

        setUsers(data); // Set the users to state

        // Update the total user count in AdminDashboard
        if (setTotalUsers) {
          setTotalUsers(data.length);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers(); // Fetch users when component mounts
  }, [setTotalUsers]);

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
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
