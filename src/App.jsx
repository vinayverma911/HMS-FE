import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Auth from "./auth/Auth.jsx";
import Register from "./auth/register/Register.jsx";
import Login from "./auth/login/Login.jsx";
import Verify from "./auth/verify/Verify.jsx";
import UserDashboard from "./user/user-dashboard.jsx";

import Home from "./user/home/Home.jsx";
import Doctors from "./user/doctors/doctors.jsx";
import Appointments from "./user/appointments/appointments.jsx";
import Profile from "./user/profile/profile.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify" element={<Verify />} />

            <Route path="*"  element={<Navigate to="/login" replace />} />
          </Route>

          <Route path="/user" element={<ProtectedRoute allowedRoles={['PATIENT']}/>}>
            <Route path="/user" element={<UserDashboard />}>
              <Route path="home" element={<Home />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="profile" element={<Profile />} />
              <Route path="dashboard" element={<Home />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
