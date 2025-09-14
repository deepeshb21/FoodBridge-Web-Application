import API from './axios';

export const fetchVerifiedNGOs = async () => {
  try {
    const res = await API.get('/users/ngos');
    return res.data; 
  } catch (err) {
    console.error('Error fetching verified NGOs:', err?.response?.data || err.message);
    return []; 
  }
};


