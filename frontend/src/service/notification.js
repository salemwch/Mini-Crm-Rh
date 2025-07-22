import HTTP from '../service/contexte_service';

export const getNotificationsByUser = async (userId) => {
  try {
    const response = await HTTP.get(`/notification/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data.notifications;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createNotification = async (payload) => {
  try {
    const response = await HTTP.post('/notification', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data.notification;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const markNotificationAsRead = async (notifId) => {
  try {
    const response = await HTTP.patch(`/notification/${notifId}/read`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data.markRead;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteNotification = async (notifId) => {
  try {
    const response = await HTTP.delete(`/notification/${notifId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data.deleteed;
  } catch (error) {
    throw error.response?.data || error;
  }
};
