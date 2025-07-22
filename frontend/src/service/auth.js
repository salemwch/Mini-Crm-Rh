import HTTP from './contexte_service'
export const Login = async (data) => {
    const response = await HTTP.post('/auth/login', data);
    return response.data;
  };
  
export const Logout = async () => {
  const logoutResponse = await HTTP.post('/auth/logout');
  return logoutResponse.data;
}


export const forgetPassword = async (email) =>{
    try{
        const response = await HTTP.post('/auth/forget-password', {email},
            {
                headers: {
                  'x-frontend-url': window.location.origin,
                },
              }
        );
        return response.data;
    }catch(error){
        return error.response?.data || error;
    }
}
export const resetPassword =  async (token, password) =>{
    try{
        const response = await HTTP.post(`/auth/reset-password/${token}`, {password});
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
};

export const verifyEmail = async (token) =>{
    try{
        const response = await HTTP.get(`/auth/verify-email/${token}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const getAllUser = async () =>{
    try{
        const response = await HTTP.get("/auth/users");
        return response.data.users;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const updateProfile = async (id, updateData, imageFile) =>{
    const formData = new FormData();

    Object.keys(updateData).forEach((key) =>{
        formData.append(key, updateData[key]);
    })
    if(imageFile) {
        formData.append('image', imageFile);
    }
    try{
        const response = await HTTP.put(`/auth/update/${id}`, formData,{
            headers : {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const  deleteAcount = async (id) =>{
    try{
        const response = await HTTP.delete(`/auth/delete/${id}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const getMe = async () => {
    try {

      const response = await HTTP.get('/auth/me');
      return response.data;
    } catch (error) {

      throw error.response?.data || error;
    }
  };
  export const refreshToken = async () => {
    console.log("[refreshToken] trying to call /auth/refresh-token");
  
    try {
      const response = await HTTP.post('/auth/refresh-token', null);
  
      const newAccessToken = response.data.accessToken;
    
      return newAccessToken;
    } catch (error) {
      console.error("[refreshToken] failed:", error.response?.data || error);
      throw error.response?.data || error;
    }
  };
  
  


