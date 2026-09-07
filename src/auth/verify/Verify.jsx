import "./Verify.css";
import { useForm } from "react-hook-form";
import { useSearchParams,useNavigate } from "react-router-dom";
import { verifyEmail } from "../../services/auth/service.user.js";

function Verify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

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
    const otp = [
      data.otp1,
      data.otp2,
      data.otp3,
      data.otp4,
      data.otp5,
      data.otp6,
    ].join("");

    const payload = {
      email: data.email,
      otp,
    };

    verifyEmail(payload)
      .then((response) => {
        if (response.status === 200) {
          console.log("Email verified:", response.data);
          navigate(`/login`);
        }
      })
      .catch((error) => {

        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (code === "USER_NOT_FOUND") {
          setError("email", {
            type: "server",
            message: "User not found",
          });
        } else if (code === "EMAIL_ALREADY_VERIFIED") {
          setError("email", {
            type: "server",
            message: "Email already verified",
          });
        } else if (code === "OTP_EXPIRED") {
          setError("otp1", {
            type: "server",
            message: "OTP has expired. Please request a new OTP.",
          });
        } else if (code === "INVALID_OTP") {
          setError("otp1", {
            type: "server",
            message: "Invalid OTP",
          });
        } else if (status === 500) {
          console.log("Server error");
        } else {
          console.log("Something went wrong");
        }
      });
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <div className="verify-icon">✉</div>

        <h2>Verify Your Email</h2>

        <p>Enter your email and the verification code sent to you.</p>
      </div>

      <form className="verify-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="email-group">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            defaultValue={email}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />

          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        <div className="otp-group">
          {["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"].map((field) => (
            <input
              key={field}
              type="text"
              maxLength="1"
              inputMode="numeric"
              {...register(field, {
                required: true,
                pattern: /^[0-9]$/,
              })}
            />
          ))}
        </div>

        {Object.keys(errors).some((key) => key.startsWith("otp")) && (
          <span className="field-error">
            Please enter a valid 6-digit verification code.
          </span>
        )}

        <button type="submit" className="verify-btn" disabled={!isValid}>
          Verify Email
        </button>
      </form>

      <div className="verify-resend">
        <span>Didn't receive the code?</span>
        <button type="button">Resend Code</button>
      </div>

      <div className="verify-back">
        <a href="/auth/register">← Back to registration</a>
      </div>
    </div>
  );
}

export default Verify;
