import HTTP from "./contexte_service";
export const createUser = async (formData) =>{
    try{
        const response = await HTTP.post("/user/create", formData, {
            headers : {
                'content-type': 'multipart/form-data'
            },
        });
        return response.data;
        
    }catch(error){
        throw error.response?.data || error;
    }
}

export const getUserByEmail = async (email) =>{
    try{
        const response = await HTTP.get(`/user/by-email`,{
            params: {email},
        });
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}

export const getUserById = async (id) =>{
    try{
        const response = await HTTP.get(`/user/id/${id}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}

export const updateUser = async (id, updateData) =>{
    try{
        const formData = new FormData();
        for(const key in updateData) {
            formData.append(key, updateData[key]);
        }
        const response = await HTTP.put(`/user/update/${id}`, formData,{
            headers:{
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}

export const deleteAccount = async (id) =>{
    try{
        const response = await  HTTP.delete(`/user/delete/${id}`);
        return  response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}

export const activeAccount = async (id) =>{
    try{
        const response = await HTTP.patch(`/user/activate/${id}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const desactiveAccount = async (id) =>{
    try{
        const response = await HTTP.patch(`/user/desactivate/${id}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}

export const pingUser = async () =>{
    try{
        const response=  await HTTP.post('/user/ping');
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const UpdateUserROle = async (id, role) =>{
    try{
        const response = await HTTP.patch(`/user/role/${id}`, {role});
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const getAllUsers = async () =>{
    try{
        const response = await HTTP.get('/user/get-all-users');
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const adminExist = async () =>{
    try{
        const response = await HTTP.get('/user/admin-exist');
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}
export const approveUser = async (id) => {
    try {
      const response = await HTTP.patch(`/user/approved/${id}`, {});
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  export const getAllUsersFiltred = async ({page =1 , limit = 10 , search ='', isActive,isApproved,isEmailVerified}) =>{
    try{
        const params = new URLSearchParams();

        params.append('page', page);
        params.append('limit', limit);
        if(search) params.append('search', search);
        if(typeof isActive === 'boolean') params.append('isActive', isActive);
        if(typeof isApproved === 'boolean') params.append('isApproved', isApproved);
        if(typeof isEmailVerified === 'boolean') params.append('isEmailVerified', isEmailVerified);

        const response = await HTTP.get(`user?${params.toString()}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    };
  }

  export const CreatedAdmin = async (formData) =>{
    try{
        const response = await HTTP.post("/user/create-admin", formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }catch(error){
        throw error.response?.data ||error;
    }

  }
  export const getRecentUsers = async (limit = 5) => {
  try {
    const response = await HTTP.get(`/user/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
