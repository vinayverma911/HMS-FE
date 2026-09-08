import api from '../api.js';

const getUserByAccessToken = async () =>{

  try{
    const response = await api.post('/user/fetchuserbytoken');
    return response;
  }catch(error){
    console.log("Error in getUserByAccessToken ",error);
    throw error;
  }

}

const checkEmailExists = async (email) => {
  try {
    const response = await api.post(`/user/check-email`,  email );
    return response;
  } catch (error) {
    throw error;
  }
};

const checkPhoneExists = async (phone) => {
  try {
    const response = await api.post(`/user/check-phone`, phone);
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  getUserByAccessToken,
  checkEmailExists,
  checkPhoneExists
};
