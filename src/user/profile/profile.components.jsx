import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EMPTY,
  formatDate,
  formatLabel,
  fullName,
  getInitials,
  nameRules,
  toDateInput,
  todayInput,
} from "./profile.utils.js";

export const Field = ({ label, value }) => (
  <div className="profile-field">
    <dt>{label}</dt>
    <dd>{value || EMPTY}</dd>
  </div>
);

export const ProfileNotice = ({ children, isError }) => (
  <div className="profile-card">
    <p className={`profile-status${isError ? " profile-status-error" : ""}`}>
      {children}
    </p>
  </div>
);

export const IdentityCard = ({ user }) => {
  const statusKey = user?.status ? String(user.status).toLowerCase() : "";

  return (
    <section className="profile-card profile-identity">
      <div className="profile-avatar" aria-hidden="true">
        {getInitials(user)}
      </div>
      <div className="profile-identity-text">
        <h2>{fullName(user)}</h2>
        <p>{user?.email || EMPTY}</p>
      </div>
      <div className="profile-chips">
        <span className="profile-chip">{formatLabel(user?.role)}</span>
        <span
          className={`profile-chip${statusKey ? ` profile-chip-${statusKey}` : ""}`}
        >
          {formatLabel(user?.status)}
        </span>
      </div>
    </section>
  );
};

export const ContactCard = ({ user }) => (
  <section className="profile-card">
    <h3>Contact</h3>
    <dl className="profile-grid">
      <Field label="Email" value={user?.email} />
      <Field label="Phone" value={user?.phone} />
    </dl>
  </section>
);

export const PersonalForm = ({ user, isActive, onCancel, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setError,
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

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!isActive) return;
    setSaveError(null);
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

    setIsSaving(true);
    setSaveError(null);

    onSave(personalUpdate)
      .catch((error) => {
        const fieldErrors = error.response?.data?.errors;
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach((item) => {
            if (item.field) {
              setError(item.field, { type: "server", message: item.message });
            }
          });
        }
        setSaveError(
          error.response?.data?.message || "Failed to update profile"
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
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

      {saveError && (
        <p className="profile-status profile-status-error">{saveError}</p>
      )}

      <div className="profile-form-actions">
        <button
          type="button"
          className="profile-cancel-btn"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="profile-save-btn"
          disabled={!isValid || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export const PersonalInfoCard = ({ user, onSave }) => {
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
            onSave={(payload) => onSave(payload).then(closeEditor)}
          />
        </div>
      </div>
    </section>
  );
};
