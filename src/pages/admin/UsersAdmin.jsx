import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase'; // Import Firebase Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../css/UsersAdmin.css'; 

export default function UsersAdmin({ setTotalUsers }) {
  const [users, setUsers] = useState([]);

  // Fetch data from Firestore 'users' collection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users'); // Reference to 'users' collection
        const q = query(usersRef, where('role', 'in', ['user'])); // Fetch only users with 'user' role

        const querySnapshot = await getDocs(q); // Get documents in 'users' collection
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map data to array

        setUsers(usersData); // Set users to state

        // Update the total user count in AdminDashboard
        if (setTotalUsers) {
          setTotalUsers(usersData.length);
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
