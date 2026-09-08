import { useOutletContext } from "react-router-dom";
import "../user-page.css";

const Doctors = () => {
  const { userData, isLoading, error } = useOutletContext() || {};
  const name = [userData?.firstName, userData?.lastName].filter(Boolean).join(" ");

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h1>Doctors</h1>
        <p>Find and book a doctor</p>
      </div>

      <div className="user-card">
        {isLoading && <p className="user-status">Loading your details...</p>}
        {error && <p className="user-status">{error}</p>}
        {!isLoading && !error && (
          <>
            <h2>{name ? `Hi ${name}` : "Doctors"}</h2>
            <p className="user-status">
              Doctor listings will show here. Signed in as {userData?.email || "—"}.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Doctors;
