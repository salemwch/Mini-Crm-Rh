import HTTP from "./contexte_service";

export const getRecentEnterprises = async (limit = 5) => {
  try {
    const response = await HTTP.get(`/enterprise/statistics/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const createEnterprise = async (enterpriseData) => {
  try {
    const response = await HTTP.post("/enterprise/enterprise-create", enterpriseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllEnterprises = async () => {
  try {
    const response = await HTTP.get("/enterprise");
    return response.data.findAllEnterprise;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getEnterprisesById = async (id) => {
  try {
    const response = await HTTP.get(`/enterprise/enterprise/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const updateEnterprise = async (id, updatedData) => {
  try {
    const response = await HTTP.patch(`/enterprise/update-enterprise/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteEnterpriseById = async (id) => {
  try {
    const response = await HTTP.delete(`/enterprise/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

 export const getEnterprises = async (queryParams = {}) => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await HTTP.get(`/enterprise?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getEnterpriseCountBySector = async () => {
  try {
    const response = await HTTP.get('/enterprise/statistics/sector-distribuation');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getInactiveEnterprisesCount = async () => {
  try {
    const response = await HTTP.get('/enterprise/statistics/inactive-count');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getAverageEnterpriseRating = async () => {
  try {
    const response = await HTTP.get('/enterprise/statistics/average-rating');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getMyEnterprises = async () => {
  try {
    const response = await HTTP.get('/enterprise/my-enterprises', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getEnterprisesWithFeedbacks = async () => {
  try {
    const response = await HTTP.get('/enterprise/with-feedbacks', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

