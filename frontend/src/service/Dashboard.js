import HTTP from "./contexte_service";

export const getGlobalStatistics = async () => {
  try {
    const response = await HTTP.get("/dashboard/statistics");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
