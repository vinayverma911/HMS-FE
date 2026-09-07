import { NavLink, Outlet } from 'react-router-dom';
import './Auth.css';

function Auth() {
  return (
    <div className="auth-page">

      <section className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">✚</div>

          <h1>Welcome to HealthCare+</h1>

          <p>
            Your health, our priority.
            <br />
            Simple and secure healthcare management.
          </p>

          <div className="brand-features">
            <div>
              <strong>Secure & Private</strong>
              <span>Your healthcare data stays protected.</span>
            </div>

            <div>
              <strong>Quick Access</strong>
              <span>Book appointments and manage your visits easily.</span>
            </div>

            <div>
              <strong>Better Care</strong>
              <span>Connect with healthcare professionals easily.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-content">
        <div className="auth-card">

          <div className="auth-tabs">
            <NavLink
              to="/login"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Register
            </NavLink>
          </div>

          <Outlet /> 

        </div>
      </section>

    </div>
  );
}

export default Auth;