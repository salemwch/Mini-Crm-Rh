import HTTP from './contexte_service';

export const createAbsence = async (absenceDto) => {
  try {
    const response = await HTTP.post('/absence', absenceDto);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserAbsences = async () => {
  try {
    const response = await HTTP.get('/absence/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllAbsences = async () => {
  try {
    const response = await HTTP.get('/absence',{
        headers:{
            'Content-Type': 'application/json',
        },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAbsenceStatus = async (id, status, responseMessage = '') => {
  try {
    const response = await HTTP.patch(`/absence/${id}/status`, {
      status,
      responseMessage,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
