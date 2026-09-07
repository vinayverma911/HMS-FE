# Repository Guidelines

This is the Vite + React patient UI for HMS (Hospital Management System). The sibling Express API lives in `../backend` (`http://localhost:3000`; CORS allows `http://localhost:5173`).

Bootstrap and routes: `src/main.jsx`, `src/App.jsx`.

Stack: React 19, Vite 8, JSX (not TypeScript), `react-router-dom` 7, Axios, react-hook-form, `jwt-decode`. Plain CSS next to components — no Tailwind, no CSS modules.

## Project structure

- `src/auth/` — login, register, verify (feature CSS next to the component; shared `Auth.css`)
- `src/user/` — patient portal shell (`user-dashboard.jsx`) and pages (`home`, `doctors`, `appointments`, `profile`)
- `src/components/` — shared UI such as `ProtectedRoute.jsx`
- `src/services/api.js` — single Axios client (base URL, credentials, interceptors)
- `src/services/<domain>/` — API wrappers; do not call Axios from components
- `public/` — static files; `src/assets/` — imported UI assets

Keep routes in `src/App.jsx`. Functional components, JSX, hooks. Two-space indent, semicolons, match quote style of the file you touch.

New files: PascalCase components (`Login.jsx`); lowercase feature folders. Existing names are mixed (`home.jsx`, `user-dashboard.jsx`) — match the folder you touch; do not mass-rename.

`App.jsx` currently imports `./components/protectedRoute.jsx` and `./user/home/Home.jsx` while the files are `ProtectedRoute.jsx` and `home.jsx`. That works on macOS and will fail on Linux. When you touch those files, align the import to the real filename; do not fix it as a drive-by.

## Commands

- `npm install` — locked dependencies
- `npm run dev` — Vite at `http://localhost:5173`
- `npm run build` — production bundle
- `npm run preview` — serve the build
- `npm run lint` — Oxlint (`.oxlintrc.json`: `react` + `oxc`)

No test suite yet. When one is added, document it here and in `package.json`.

## Auth and HTTP

- Axios `baseURL`: `http://localhost:3000/v1/api`, `withCredentials: true`.
- Access token is stored in `localStorage` as `accessToken` and attached as `Authorization: Bearer …` unless the request sets `skipAuth: true` (login, register, send-otp, verify).
- Login stores the token and navigates to `/user/dashboard`.
- Dashboard loads the user via `POST /user/fetchuserbytoken`.
- `ProtectedRoute` decodes the JWT with `jwt-decode` and gates on `role`. Patient routes allow `PATIENT` only; missing or wrong role → `/login`.
- Auth forms use react-hook-form (`mode: "onChange"`) and map `error.response.data.code` with `setError`. Handle those codes in screens; do not swallow Axios errors in services.
- Codes already handled: `USER_NOT_FOUND`, `EMAIL_NOT_VERIFIED`, `WRONG_PASSWORD`, `EMAIL_ALREADY_EXISTS`, `PHONE_ALREADY_EXISTS`, `EMAIL_ALREADY_VERIFIED`, `OTP_EXPIRED`, `INVALID_OTP`.
- The response interceptor only `console.log`s. That is not error handling.
- There is no refresh-token interceptor. The backend may set a refresh cookie, but it has no refresh or logout route yet. Do not invent a refresh flow in the client unless the backend exposes one.
- Prefer `import.meta.env.VITE_*` for the API URL on new work instead of hardcoding localhost. Do not migrate the existing `baseURL` unless asked.

## Routes

Public, nested under `Auth`: `/login`, `/register`, `/verify?email=…`. Unknown paths under `/` redirect to `/login`.

Patient, nested under `ProtectedRoute` (`allowedRoles={['PATIENT']}`) and `UserDashboard`:

- `/user/home`, `/user/doctors`, `/user/appointments`, `/user/profile`
- `/user/dashboard` is an alias of Home

## Current screens vs API

Auth is wired: register → send OTP → verify → login → `/user/dashboard`.

Placeholder pages (no API yet): Home, Doctors, Appointments, Profile. The sidebar Logout button is not wired.

`checkEmailExists` / `checkPhoneExists` exist in `service.user.js` but are not exported; those backend routes do not exist. Do not wire or add them unless asked.

## Commits

Short imperative subjects (`Add appointment list`). PRs should note API-contract changes, list `npm run lint` / `npm run build`, and include UI screenshots.
