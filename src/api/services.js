import API from './axios';

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);

// Users
export const getMyProfile   = ()     => API.get('/users/me');
export const getUserById    = (id)   => API.get(`/users/${id}`);
export const getAllUsers     = ()     => API.get('/users');
export const updateMyProfile = (data) => API.put('/users/me', data);

// Skills
export const getAllSkills  = (params) => API.get('/skills', { params });
export const addSkill      = (data)   => API.post('/skills', data);
export const deleteSkill   = (id)     => API.delete(`/skills/${id}`);

// Requests
export const sendRequest    = (data)        => API.post('/requests', data);
export const getMyRequests  = ()            => API.get('/requests');
export const updateRequest  = (id, status)  => API.put(`/requests/${id}`, { status });

// Exchanges
export const getMyExchanges  = ()    => API.get('/exchanges');
export const getExchangeById = (id)  => API.get(`/exchanges/${id}`);
export const sendMessage     = (id, text) => API.post(`/exchanges/${id}/messages`, { text });
export const getMessages     = (id)  => API.get(`/exchanges/${id}/messages`);
export const leaveReview     = (id, data) => API.post(`/exchanges/${id}/reviews`, data);
