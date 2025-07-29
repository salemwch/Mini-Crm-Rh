import HTTP from "./contexte_service";
export const createEvent = async (formData) => {
  try {
    const response = await HTTP.post('/event/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
export const getTodayEvents = async () => {
  try {
    const response = await HTTP.get('/event/latest', {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
