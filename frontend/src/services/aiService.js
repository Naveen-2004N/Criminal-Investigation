import api from './api.js';

export const generateSketch = async (prompt) => {
  const { data } = await api.post('/ai/generate-sketch', { prompt });
  return data; // Returns { image: 'base64_data_url' }
};