export const EMPTY = "—";
export const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]*$/;

export const toDateInput = (value) => {
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

export const todayInput = () => toDateInput(new Date());

export const formatDate = (value) => {
  if (!value) return EMPTY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatLabel = (value) => {
  if (!value) return EMPTY;
  const text = String(value).replaceAll("_", " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getInitials = (user) => {
  const parts = [user?.firstName, user?.lastName].filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const fullName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") || EMPTY;

export const nameRules = (label) => ({
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
