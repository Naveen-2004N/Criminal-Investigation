import api from './api';

export const registerDeviceToken = async (token) => {
  try {
    const { data } = await api.post('/notify/register-device', { token });
    return data;
  } catch (error) {
    console.error('Error registering device token:', error.response.data);
    throw error;
  }
};

export const notifyDetection = async (criminalName, location) => {
  try {
    const { data } = await api.post('/notify/detection', { criminalName, location });
    console.log('Detection notification sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending detection notification:', error.response.data);
    throw error;
  }
};