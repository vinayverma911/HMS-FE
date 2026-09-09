import { useOutletContext } from "react-router-dom";
import { updateUser } from "../../services/user/service.user.js";
import {
  ContactCard,
  IdentityCard,
  PersonalInfoCard,
  ProfileNotice,
} from "./profile.components.jsx";
import "./profile.css";

const Profile = () => {
  const { userData, setUserData, isLoading, error } = useOutletContext() || {};
  const displayUser = userData || {};

  const handlePersonalSave = (payload) =>
    updateUser(payload).then((response) => {
      const updated = response.data?.data;
      if (updated && setUserData) {
        setUserData((current) => ({ ...current, ...updated }));
      }


      return response;
    });

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Profile</h1>
        <p>Your account details</p>
      </header>

      {isLoading && (
        <ProfileNotice>Loading your profile...</ProfileNotice>
      )}

      {error && <ProfileNotice isError>{error}</ProfileNotice>}

      {!isLoading && !error && (
        <>
          <IdentityCard user={displayUser} />
          <PersonalInfoCard user={displayUser} onSave={handlePersonalSave} />
          <ContactCard user={displayUser} />
        </>
      )}
    </div>
  );
};

export default Profile;
