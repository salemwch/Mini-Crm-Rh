import HTTP from './contexte_service';
export const createJobOffer = async (createJobOfferDto) => {
  try {
    const response = await HTTP.post('/job-offer/create', createJobOfferDto, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const updateJobOffer = async (id, updateJobOfferDto) => {
  try {
    const response = await HTTP.put(`/job-offer/update/${id}`, updateJobOfferDto, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getJobOfferById = async (id) => {
  try {
    const response = await HTTP.get(`/job-offer/get/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const deleteJobOffer = async (id) => {
  try {
    const response = await HTTP.delete(`/job-offer/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getAllJobOffers = async (filter = {}, page = 1, limit = 10) => {
  try {
    const filterString = JSON.stringify(filter);

    const response = await HTTP.get('/job-offer', {
      params: {
        filter: filterString,
        page,
        limit,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const incrementViewCount = async (id) => {
  try {
    const response = await HTTP.patch(`/job-offer/${id}/view-count`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getActiveJobOffers = async () => {
  try {
    const response = await HTTP.get('/job-offer/active', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getExpiredJobOffers = async () => {
  try {
    const response = await HTTP.get('/job-offer/expired', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const searchJobOffers = async (query, filters = {}, page = 1, limit = 10) => {
  try {
    const params = {
      query,
      page,
      limit,
      ...filters,
    };

    const response = await HTTP.get('/job-offer/search', {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getJobOfferStatistics = async () => {
  try {
    const response = await HTTP.get('/job-offer/statistics', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getJobOffersByEnterprise = async (enterpriseId) => {
  try {
    const response = await HTTP.get(`/job-offer/by-enterprise/${enterpriseId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
