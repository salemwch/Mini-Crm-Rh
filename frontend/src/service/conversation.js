import HTTP from "./contexte_service";
export const createGroup = async (groupData) => {
  try {
    const response = await HTTP.post('/conversations/group', groupData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const sendMessage = async (payload) => {
  try {
    const response = await HTTP.post('/conversations/message', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const markMessageAsSeen = async (messageId) => {
  try {
    const response = await HTTP.post(`/conversations/message/${messageId}/seen`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getAllMessagesForGroup = async (groupId) => {
  try {
    const response = await HTTP.get(`/conversations/group/${groupId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getPaginatedMessages = async (groupId, page = 1, limit = 10) => {
  try {
    const response = await HTTP.get(
  `/conversations/group/${groupId}/messages/paginated?page=${page}&limit=${limit}`
);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getUserGroups = async (userId) => {
  try {
    const response = await HTTP.get(`/conversations?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getGlobalGroup = async () => {
  try {
    const response = await HTTP.get(`/conversations/global-group`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
