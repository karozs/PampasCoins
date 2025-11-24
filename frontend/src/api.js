import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
};

export const buyProduct = async (purchaseData) => {
    const response = await axios.post(`${API_URL}/buy`, purchaseData);
    return response.data;
};

export const getUserTransactions = async (userId) => {
    const response = await axios.get(`${API_URL}/history/${userId}`);
    return response.data;
};

export const getUserProfile = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
};

export const getUserReviews = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}/reviews`);
    return response.data;
};

export const getPopularProducts = async () => {
    const response = await axios.get(`${API_URL}/products/popular`);
    return response.data;
};

export const updateUserProfile = async (userId, profileData) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, profileData);
    return response.data;
};

export const uploadProfilePhoto = async (userId, formData) => {
    const response = await axios.post(`${API_URL}/users/${userId}/photo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const uploadCoverImage = async (userId, formData) => {
    const response = await axios.post(`${API_URL}/users/${userId}/cover`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

