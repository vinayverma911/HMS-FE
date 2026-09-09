import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { getUserByAccessToken } from "../services/user/service.user.js";
import "./user-dashboard.css";

function UserDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    getUserByAccessToken()
      .then((response) => {
        setUserData(response.data?.data ?? null);
        setError(null);
      })
      .catch((err) => {
        console.log("Error in UserDashboard.jsx : ", err);
        setUserData(null);
        setError(err.response?.data?.message || "Failed to load user");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h2>HealthCare+</h2>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">✚</div>

          <div>
            <h2>HealthCare+</h2>
            <span>Patient Portal</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <NavLink to="/user/profile">Profile</NavLink>
          <NavLink to="/user/home">Home</NavLink>
          <NavLink to="/user/doctors">Doctors</NavLink>
          <NavLink to="/user/appointments">Appointments</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn">
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Outlet context={{ userData, setUserData, isLoading, error }} />
        </div>
      </main>
    </div>
  );

}

export default UserDashboard;
