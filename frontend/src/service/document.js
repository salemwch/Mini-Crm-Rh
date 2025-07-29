import HTTP from "./contexte_service";

export const uploadDocument = async (formData) => {
  try {
    const response = await HTTP.post('/document/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error.response?.data || error.message);
    throw error;
  }
};

export const getDocumentsByEnterprise =  async (enterpriseId) =>{

    try{
        const response = await HTTP.get(`/document/enterprise/${enterpriseId}`,{
            withCredentials: true,
        });
        return response.data;
    }catch(error){
        console.error('error fetching documents by enterprise', error.response?.data || error.message);
        throw error;
    }
}
export const getDocumentsByName = async (name) => {
  try {
    const response = await HTTP.get(`/document/search`, {
      params: { name },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents by name:', error.response?.data || error.message);
    throw error;
  }
};
export const getAllDocuments = async () => {
  try {
    const response = await HTTP.get('/document', {
      withCredentials: true,
    });
    return response.data.document;
  } catch (error) {
    console.error(' Error fetching all documents:', error.response?.data || error.message);
    throw error;
  }
};