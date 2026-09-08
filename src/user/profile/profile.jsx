import { useOutletContext } from "react-router-dom";
import "./profile.css";

const EMPTY = "—";

const formatDate = (value) => {
  if (!value) return EMPTY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatLabel = (value) => {
  if (!value) return EMPTY;
  const text = String(value).replaceAll("_", " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getInitials = (user) => {
  const parts = [user?.firstName, user?.lastName].filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const Field = ({ label, value }) => (
  <div className="profile-field">
    <dt>{label}</dt>
    <dd>{value || EMPTY}</dd>
  </div>
);

const Profile = () => {
  
  const { userData, isLoading, error } = useOutletContext() || {};
  const name =
    [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") ||
    EMPTY;
  const statusKey = userData?.status
    ? String(userData.status).toLowerCase()
    : "";

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Profile</h1>
        <p>Your account details</p>
      </header>

      {isLoading && (
        <div className="profile-card">
          <p className="profile-status">Loading your profile...</p>
        </div>
      )}

      {error && (
        <div className="profile-card">
          <p className="profile-status profile-status-error">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <section className="profile-card profile-identity">
            <div className="profile-avatar" aria-hidden="true">
              {getInitials(userData)}
            </div>
            <div className="profile-identity-text">
              <h2>{name}</h2>
              <p>{userData?.email || EMPTY}</p>
            </div>
            <div className="profile-chips">
              <span className="profile-chip">
                {formatLabel(userData?.role)}
              </span>
              <span
                className={`profile-chip${statusKey ? ` profile-chip-${statusKey}` : ""}`}
              >
                {formatLabel(userData?.status)}
              </span>
            </div>
          </section>

          <section className="profile-card">
            <h3>Personal information</h3>
            <dl className="profile-grid">
              <Field label="First name" value={userData?.firstName} />
              <Field label="Last name" value={userData?.lastName} />
              <Field label="Date of birth" value={formatDate(userData?.dob)} />
              <Field label="Gender" value={formatLabel(userData?.gender)} />
            </dl>
          </section>

          <section className="profile-card">
            <h3>Contact</h3>
            <dl className="profile-grid">
              <Field label="Email" value={userData?.email} />
              <Field label="Phone" value={userData?.phone} />
            </dl>
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;
