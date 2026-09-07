import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginUser, sendOtp } from '../../services/auth/service.user.js';

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    
    loginUser(data).then((response) => {
      localStorage.setItem('accessToken', response.data?.accessToken);
      console.log("Access Token in Login.jsx 20 :", localStorage.getItem('accessToken'));
      navigate('/user/dashboard');
    }).catch((error) => {
      
      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (status === 404 || code === "USER_NOT_FOUND") {
        console.log("User not found");
        setError('email', {type: 'server', message: 'User not found' });
      } 

      else if (status === 403 || code === "EMAIL_NOT_VERIFIED") {
          console.log("Email not verified");
      
          sendOtp(data.email)
          .then(() => {
            navigate(`/verify?email=${encodeURIComponent(data.email)}`);
          })
          .catch((error) => {
            alert("Error sending OTP. Please try again later.");
            console.log("Error sending OTP:", error);
          })
          

      }

      else if (status === 401 || code === "WRONG_PASSWORD") {
        console.log("Invalid password");
        setError('password', { type: 'server', message: 'Invalid password' });
      }

      else if (status === 500) {
        console.log("Server error");
      }

      else {
        console.log("Something went wrong");
      }

    });
  };

  return (
    <div className="auth-form-container">

      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit(onSubmit)}
      >

        {/* Email */}

        <div className="form-group">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={errors.email ? 'input-error' : ''}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address',
              },
            })}
          />

          {errors.email && (
            <span className="field-error">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="password-input">
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={errors.password ? 'input-error' : ''}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters long',
                },
              })}
            />

            <button
              type="button"
              className="password-toggle"
            >
              Show
            </button>
          </div>

          {errors.password && (
            <span className="field-error">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!isValid}
        >
          Login
        </button>

      </form>

      <div className="auth-footer">
        Don't have an account?
        <a href="/register"> Register</a>
      </div>

    </div>
  );
}

export default Login;