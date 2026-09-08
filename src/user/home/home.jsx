import { useOutletContext } from "react-router-dom";
import "../user-page.css";

const Home = () => {
  const { userData, isLoading, error } = useOutletContext() || {};
  const firstName = userData?.firstName || "there";

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h1>Home</h1>
        <p>Your patient dashboard</p>
      </div>

      <div className="user-card">
        {isLoading && <p className="user-status">Loading your details...</p>}
        {error && <p className="user-status">{error}</p>}
        {!isLoading && !error && (
          <>
            <h2>Welcome back, {firstName}</h2>
            <dl className="user-meta">
              <div>
                <dt>Email</dt>
                <dd>{userData?.email || "—"}</dd>
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

export default Home;
