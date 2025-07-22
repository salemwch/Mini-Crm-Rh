import HTTP from "./contexte_service";

export const getRecentAuditLogs = async (limit = 5) => {
  try {
    const response = await HTTP.get(`/audit-log/recents-auditlog?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
