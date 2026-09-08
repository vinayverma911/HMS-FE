import "./Register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import {sendOtp, registerUser} from "../../services/auth/service.authuserservice.js";

function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    registerUser(data)
      .then((response) => {
        console.log("Registration successful:", response);
        if (response.status === 201) {
          console.log("Registration successful:", response.data);

          sendOtp(data.email)
              .then(() => {
                navigate(`/verify?email=${encodeURIComponent(data.email)}`);
              })
              .catch((error) => {
                alert("Error sending OTP. Please try again later.");
                console.log("Error sending OTP:", error);
              });
        }
      })
      .catch((error) => {
        console.log("Error in onSubmit :", error);

        const status = error.response?.status;
        const code = error.response?.data?.code;

        console.log("Error status:", status);

        if (status === 400 ) {
          setError("email", {
            type: "server",
            message: "Invalid email format",
          });
        }

        if (status === 409) {
          if (code === "EMAIL_ALREADY_EXISTS") {
            setError("email", {
              type: "server",
              message: "Email is already registered",
            });
          }

          if (code === "PHONE_ALREADY_EXISTS") {
            setError("phone", {
              type: "server",
              message: "Phone number is already registered",
            });
          }

          if (code === "EMAIL_NOT_VERIFIED") {
            sendOtp(data.email)
              .then(() => {
                navigate(`/verify?email=${encodeURIComponent(data.email)}`);
              })
              .catch((error) => {
                alert("Error sending OTP. Please try again later.");
                console.log("Error sending OTP:", error);
              });
          }
        } else if (status === 500) {
          console.log("Server error");
        } else {
          console.log("Something went wrong");
        }
      });
  };

  return (
    <div className="register-container">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Register as a patient</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        {/* First Name + Last Name */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>

            <input
              id="firstName"
              type="text"
              placeholder="First name"
              className={errors.firstName ? "input-error" : ""}
              {...register("firstName", {
                required: "First name is required",
              })}
            />

            {errors.firstName && (
              <span className="field-error">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>

            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              className={errors.lastName ? "input-error" : ""}
              {...register("lastName", {
                required: "Last name is required",
              })}
            />

            {errors.lastName && (
              <span className="field-error">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={errors.email ? "input-error" : ""}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">
            Phone <span>(Optional)</span>
          </label>

          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            className={errors.phone ? "input-error" : ""}
            {...register("phone")}
          />
          {errors.phone && (
            <span className="field-error">{errors.phone.message}</span>
          )}
        </div>

        {/* Gender + Blood Group */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender</label>

            <select
              id="gender"
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

          <div className="form-group">
            <label htmlFor="bloodGroup">
              Blood Group <span>(Optional)</span>
            </label>

            <select id="bloodGroup" {...register("bloodGroup")}>
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        {/* DOB + Password */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>

            <input
              id="dob"
              type="date"
              className={errors.dob ? "input-error" : ""}
              {...register("dob", {
                required: "Date of birth is required",
              })}
            />

            {errors.dob && (
              <span className="field-error">{errors.dob.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              className={errors.password ? "input-error" : ""}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters long",
                },
              })}
            />

            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={!isValid}>
          Create Account
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?
        <a href="/auth/login"> Login</a>
      </div>
    </div>
  );
}

export default Register;
