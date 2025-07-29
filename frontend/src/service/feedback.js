import HTTP from "./contexte_service";

export const createFeedback = async (feedbackData) => {
  try {
    const response = await HTTP.post('/feedbacks/create', feedbackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getAllFeedbacks = async () => {
  try {
    const response = await HTTP.get('/feedbacks');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFeedbacksByEnterprise = async (enterpriseId) => {
  try {
    const response = await HTTP.get(`/feedbacks/by-enterprise/${enterpriseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFeedbackById = async (id) => {
  try {
    const response = await HTTP.get(`/feedbacks/feedback/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const updateFeedback = async (id, updatedData) => {
  const response = await HTTP.patch(`/feedbacks/update/${id}`, updatedData);
  return response.data;
};
export const removeFeedback = async (id) => {
  try {
    const response = await HTTP.delete(`/feedbacks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getLastFiveFeedbacks = async () => {
  const response = await HTTP.get('/feedbacks/last-5');
  return response.data;
};