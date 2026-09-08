import { useOutletContext } from "react-router-dom";
import "../user-page.css";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
};

const Profile = () => {
  const { userData, isLoading, error } = useOutletContext() || {};
  const name = [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h1>Profile</h1>
        <p>Your account details</p>
      </div>

      <div className="user-card">
        {isLoading && <p className="user-status">Loading your profile...</p>}
        {error && <p className="user-status">{error}</p>}
        {!isLoading && !error && (
          <>
            <h2>{name}</h2>
            <dl className="user-meta">
              <div>
                <dt>First name</dt>
                <dd>{userData?.firstName || "—"}</dd>
              </div>
              <div>
                <dt>Last name</dt>
                <dd>{userData?.lastName || "—"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{userData?.email || "—"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{userData?.phone || "—"}</dd>
              </div>
              <div>
                <dt>Date of birth</dt>
                <dd>{formatDate(userData?.dob)}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{userData?.gender || "—"}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{userData?.role || "—"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{userData?.status || "—"}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
