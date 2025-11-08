import api from './api.js';

// Registers a new criminal with their data, images, and face descriptors
export const registerCriminal = async (criminalData) => {
  const { data } = await api.post('/criminals', criminalData);
  return data;
};

// Fetches a list of criminals. Can be used for searching.
// If search is empty, it returns the latest 20 criminals.
export const getCriminals = async (search = '') => {
  const { data } = await api.get(`/criminals?search=${encodeURIComponent(search)}`);
  return data;
};

export const getCriminalById = async (id) => {
  const { data } = await api.get(`/criminals/${id}`);
  return data;
};

export const deleteCriminal = async (id) => {
  const { data } = await api.delete(`/criminals/${id}`);
  return data;
};

export const getLabeledFaceDescriptors = async () => {
    const { data } = await api.get('/criminals/descriptors');
    return data;
}

// *** ADD THIS FUNCTION ***
export const detectCriminals = async (base64Image) => {
  const { data } = await api.post('/detect', { image: base64Image });
  return data;
};