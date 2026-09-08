import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import "./profile.css";

const EMPTY = "—";
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]*$/;

const toDateInput = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayInput = () => toDateInput(new Date());

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

const nameRules = (label) => ({
  required: `${label} is required`,
  minLength: {
    value: 2,
    message: `${label} must be at least 2 characters`,
  },
  maxLength: {
    value: 50,
    message: `${label} must be at most 50 characters`,
  },
  pattern: {
    value: NAME_PATTERN,
    message: `${label} can only contain letters`,
  },
  validate: (value) =>
    value.trim().length >= 2 || `${label} is required`,
});

const PersonalForm = ({ user, isActive, onCancel, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dob: toDateInput(user?.dob),
      gender: user?.gender || "",
    },
  });

  useEffect(() => {
    if (!isActive) return;
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dob: toDateInput(user?.dob),
      gender: user?.gender || "",
    });
    trigger();
  }, [
    isActive,
    reset,
    trigger,
    user?.firstName,
    user?.lastName,
    user?.dob,
    user?.gender,
  ]);

  const onSubmit = (data) => {
    const personalUpdate = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dob: data.dob,
      gender: data.gender,
    };
    onSave(personalUpdate);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="profile-form-row">
        <div className="profile-form-group">
          <label htmlFor="profile-firstName">First name</label>
          <input
            id="profile-firstName"
            type="text"
            placeholder="First name"
            className={errors.firstName ? "input-error" : ""}
            {...register("firstName", nameRules("First name"))}
          />
          {errors.firstName && (
            <span className="field-error">{errors.firstName.message}</span>
          )}
        </div>

        <div className="profile-form-group">
          <label htmlFor="profile-lastName">Last name</label>
          <input
            id="profile-lastName"
            type="text"
            placeholder="Last name"
            className={errors.lastName ? "input-error" : ""}
            {...register("lastName", nameRules("Last name"))}
          />
          {errors.lastName && (
            <span className="field-error">{errors.lastName.message}</span>
          )}
        </div>
      </div>

      <div className="profile-form-row">
        <div className="profile-form-group">
          <label htmlFor="profile-dob">Date of birth</label>
          <input
            id="profile-dob"
            type="date"
            max={todayInput()}
            className={errors.dob ? "input-error" : ""}
            {...register("dob", {
              required: "Date of birth is required",
              validate: (value) =>
                new Date(value) <= new Date() ||
                "Date of birth cannot be in the future",
            })}
          />
          {errors.dob && (
            <span className="field-error">{errors.dob.message}</span>
          )}
        </div>

        <div className="profile-form-group">
          <label htmlFor="profile-gender">Gender</label>
          <select
            id="profile-gender"
            className={errors.gender ? "input-error" : ""}
            {...register("gender", {
              required: "Gender is required",
            })}
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && (
            <span className="field-error">{errors.gender.message}</span>
          )}
        </div>
      </div>

      <div className="profile-form-actions">
        <button type="button" className="profile-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="profile-save-btn" disabled={!isValid}>
          Save
        </button>
      </div>
    </form>
  );
};

const PersonalInfoCard = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const innerRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const face = isEditing ? backRef.current : frontRef.current;
    if (!inner || !face) return;

    const setHeight = () => {
      inner.style.height = `${face.offsetHeight}px`;
    };

    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(face);
    return () => observer.disconnect();
  }, [isEditing, user?.firstName, user?.lastName, user?.dob, user?.gender]);

  const closeEditor = () => setIsEditing(false);

  return (
    <section
      className={`profile-card profile-flip${isEditing ? " is-flipped" : ""}`}
    >
      <div className="profile-flip-inner" ref={innerRef}>
        <div
          className="profile-flip-face profile-flip-front"
          ref={frontRef}
          aria-hidden={isEditing}
        >
          <div className="profile-card-head">
            <h3>Personal information</h3>
            <button
              type="button"
              className="profile-text-btn"
              onClick={() => setIsEditing(true)}
              tabIndex={isEditing ? -1 : 0}
            >
              Edit
            </button>
          </div>
          <dl className="profile-grid">
            <Field label="First name" value={user?.firstName} />
            <Field label="Last name" value={user?.lastName} />
            <Field label="Date of birth" value={formatDate(user?.dob)} />
            <Field label="Gender" value={formatLabel(user?.gender)} />
          </dl>
        </div>

        <div
          className="profile-flip-face profile-flip-back"
          ref={backRef}
          aria-hidden={!isEditing}
        >
          <div className="profile-card-head">
            <h3>Personal information</h3>
            <button
              type="button"
              className="profile-text-btn"
              onClick={closeEditor}
              tabIndex={isEditing ? 0 : -1}
            >
              Cancel
            </button>
          </div>
          <PersonalForm
            user={user}
            isActive={isEditing}
            onCancel={closeEditor}
            onSave={(payload) => {
              onSave(payload);
              closeEditor();
            }}
          />
        </div>
      </div>
    </section>
  );
};

const Profile = () => {
  const { userData, isLoading, error } = useOutletContext() || {};
  const [personalUpdate, setPersonalUpdate] = useState(null);
  const displayUser = { ...(userData || {}), ...(personalUpdate || {}) };
  const name =
    [displayUser?.firstName, displayUser?.lastName].filter(Boolean).join(" ") ||
    EMPTY;
  const statusKey = displayUser?.status
    ? String(displayUser.status).toLowerCase()
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
              {getInitials(displayUser)}
            </div>
            <div className="profile-identity-text">
              <h2>{name}</h2>
              <p>{displayUser?.email || EMPTY}</p>
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

          <PersonalInfoCard
            user={displayUser}
            onSave={setPersonalUpdate}
          />

          <section className="profile-card">
            <h3>Contact</h3>
            <dl className="profile-grid">
              <Field label="Email" value={displayUser?.email} />
              <Field label="Phone" value={displayUser?.phone} />
            </dl>
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;
