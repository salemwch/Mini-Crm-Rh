import HTTP from "./contexte_service";
export const createContact = async (contactData) => {
  try {
    const response = await HTTP.post("/contact", contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getMyContacts = async () => {
  try {
    const response = await HTTP.get("/contact/my-contacts");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getEnterpriseById = async (id) =>{
  try{
    const response = await HTTP.get(`/contact/enterprise/${id}`);
    return response.data;
  }catch(error){
    throw error.response?.data || error.message || error;
  }
}
export const getContactById = async (id) => {
  try {
    const response = await HTTP.get(`/contact/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};
export const getEnterprisesWithContacts = async () => {
  try {
    const response = await HTTP.get('/enterprise/with-contacts');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};
export const updateContact = async (id, updatedData) => {
  try {
    const response = await HTTP.patch(`/contact/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};
export const deleteContact = async (id) => {
  try {
    const response = await HTTP.delete(`/contact/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};
export const searchContacts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await HTTP.get(`/contact/search?${queryParams}`);
    console.log('response:', response);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};