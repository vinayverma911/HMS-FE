import api from '../api.js';

const loginUser = async ({email, password}) => {
  
  try {
    const response = await api.post('/user/login', { email, password }, { skipAuth: true });
    return response;
  } catch (error) {
    console.log("LOGIN SERVICE CATCH");
    throw error; 
  }
};

const sendOtp = async (email) => {
  try {
    const response = await api.post('/user/send-otp', { email }, { skipAuth: true });
    return response;
  } catch (error) {
    throw error; 
  }
};

const verifyEmail = async ({email, otp}) => {
  try {
    const response = await api.post('/user/verify', { email, otp }, { skipAuth: true });
    return response; // Return the status code directly
  } catch (error) {
    throw error; 
  }
};

const registerUser = async (data) => {
  try {
    const response = await api.post('/user/register', data, {skipAuth: true});
    return response;
  } catch (error) {
    // throw new Error(error.response?.data?.message || 'Registration failed');
    throw error; // Re-throw the original error to be handled in the calling function
  }
};

export default registerUser;    

export {
  loginUser,
  sendOtp,
  verifyEmail,
  registerUser
};
