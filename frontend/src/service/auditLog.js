import HTTP from "./contexte_service";

export const getRecentAuditLogs = async (limit = 5) => {
  try {
    const response = await HTTP.get(`/audit-log/recents-auditlog?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getAllAuditLogs = async () => {
  try {
    const response = await HTTP.get('/audit-log');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const fetchAuditLogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await HTTP.get(`/audit-log/search?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
