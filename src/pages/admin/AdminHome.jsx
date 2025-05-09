export default function AdminHome() {
  return (
    <>
      <div className="dashboard-card">
        <h2>Admin Control Panel</h2>
        <p>This is a protected route accessible only to authenticated users with the role "admin".</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card admin-stat">
          <h3>Total Users</h3>
          <p className="stat-number">124</p>
        </div>
        <div className="stat-card admin-stat">
          <h3>Active Projects</h3>
          <p className="stat-number">37</p>
        </div>
        <div className="stat-card admin-stat">
          <h3>System Status</h3>
          <p className="stat-number">Online</p>
        </div>
      </div>

      <div className="admin-controls">
        <h3>Quick Actions</h3>
        <div className="admin-buttons">
          <button className="admin-action-button">Manage Users</button>
          <button className="admin-action-button">System Settings</button>
          <button className="admin-action-button">View Reports</button>
          <button className="admin-action-button">Audit Logs</button>
        </div>
      </div>
    </>
  );
}
