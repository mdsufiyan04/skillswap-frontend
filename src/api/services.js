import API from './axios';
import { retryWithBackoff } from './retry';

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const checkApiHealth = () => API.get('/health');
export const loginUser    = async (data) => {
  await retryWithBackoff(() => checkApiHealth(), 3, 1000, 4000);
  return retryWithBackoff(() => API.post('/auth/login', data), 3, 1200, 5000);
};

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
export const getMyExchanges       = ()    => API.get('/exchanges');
export const getExchangeById      = (id)  => API.get(`/exchanges/${id}`);
export const updateExchangeProgress = (id, data) => API.put(`/exchanges/${id}/progress`, data);
export const addExchangeResource  = (id, data) => API.post(`/exchanges/${id}/resources`, data);
export const sendMessage          = (id, text) => API.post(`/exchanges/${id}/messages`, { text });
export const getMessages          = (id)  => API.get(`/exchanges/${id}/messages`);
export const leaveReview          = (id, data) => API.post(`/exchanges/${id}/reviews`, data);

// Projects
export const getAllProjects      = (params) => API.get('/projects', { params });
export const getProjectById      = (id)      => API.get(`/projects/${id}`);
export const createProject       = (data)    => API.post('/projects', data);
export const updateProject       = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject       = (id)      => API.delete(`/projects/${id}`);
export const applyToProject      = (id, data) => API.post(`/projects/${id}/apply`, data);
export const getApplications     = (id)      => API.get(`/projects/${id}/applications`);
export const updateApplication   = (id, appId, status) => API.put(`/projects/${id}/applications/${appId}`, { status });
export const getProjectMessages  = (id)      => API.get(`/projects/${id}/messages`);
export const sendProjectMessage  = (id, text) => API.post(`/projects/${id}/messages`, { text });
export const createProjectPost   = (id, content) => API.post(`/projects/${id}/posts`, { content });
export const getProjectTasks     = (id)      => API.get(`/projects/${id}/tasks`);
export const createProjectTask   = (id, data) => API.post(`/projects/${id}/tasks`, data);
export const updateProjectTask   = (id, taskId, status) => API.put(`/projects/${id}/tasks/${taskId}`, { status });
export const getMyProjects       = ()        => API.get('/projects/my/projects');
