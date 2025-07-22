import HTTP from "./contexte_service";
export const createContact = async (contactData) => {
  try {
    const response = await HTTP.post("/contact", contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};