import { useOutletContext } from "react-router-dom";
import "../user-page.css";

const Appointments = () => {
  const { userData, isLoading, error } = useOutletContext() || {};
  const name = [userData?.firstName, userData?.lastName].filter(Boolean).join(" ");

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h1>Appointments</h1>
        <p>Your upcoming and past visits</p>
      </div>

      <div className="user-card">
        {isLoading && <p className="user-status">Loading your details...</p>}
        {error && <p className="user-status">{error}</p>}
        {!isLoading && !error && (
          <>
            <h2>{name ? `${name}'s appointments` : "Appointments"}</h2>
            <p className="user-status">
              Appointment list will show here. Signed in as {userData?.email || "—"}.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments;
