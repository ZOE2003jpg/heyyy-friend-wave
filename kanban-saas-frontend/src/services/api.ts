import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: (email: string, password: string) => 
    api.post('/login', { email, password }),
  
  register: (name: string, email: string, password: string, password_confirmation: string) => 
    api.post('/register', { name, email, password, password_confirmation }),
  
  logout: () => api.post('/logout'),
  
  getUser: () => api.get('/user'),
};

// Teams services
export const teamsService = {
  getTeams: () => api.get('/teams'),
  getTeam: (id: string) => api.get(`/teams/${id}`),
  createTeam: (data: any) => api.post('/teams', data),
  updateTeam: (id: string, data: any) => api.put(`/teams/${id}`, data),
  deleteTeam: (id: string) => api.delete(`/teams/${id}`),
};

// Projects services
export const projectsService = {
  getProjects: (teamId: string) => api.get(`/teams/${teamId}/projects`),
  getProject: (teamId: string, id: string) => api.get(`/teams/${teamId}/projects/${id}`),
  createProject: (teamId: string, data: any) => api.post(`/teams/${teamId}/projects`, data),
  updateProject: (teamId: string, id: string, data: any) => api.put(`/teams/${teamId}/projects/${id}`, data),
  deleteProject: (teamId: string, id: string) => api.delete(`/teams/${teamId}/projects/${id}`),
};

// Boards services
export const boardsService = {
  getBoards: (projectId: string) => api.get(`/projects/${projectId}/boards`),
  getBoard: (projectId: string, id: string) => api.get(`/projects/${projectId}/boards/${id}`),
  createBoard: (projectId: string, data: any) => api.post(`/projects/${projectId}/boards`, data),
  updateBoard: (projectId: string, id: string, data: any) => api.put(`/projects/${projectId}/boards/${id}`, data),
  deleteBoard: (projectId: string, id: string) => api.delete(`/projects/${projectId}/boards/${id}`),
};

// Columns services
export const columnsService = {
  getColumns: (boardId: string) => api.get(`/boards/${boardId}/columns`),
  createColumn: (boardId: string, data: any) => api.post(`/boards/${boardId}/columns`, data),
  updateColumn: (id: string, data: any) => api.put(`/columns/${id}`, data),
  deleteColumn: (id: string) => api.delete(`/columns/${id}`),
  reorderColumn: (boardId: string, data: any) => api.post(`/boards/${boardId}/columns/reorder`, data),
};

// Cards services
export const cardsService = {
  getCards: (columnId: string) => api.get(`/columns/${columnId}/cards`),
  getCard: (id: string) => api.get(`/cards/${id}`),
  createCard: (columnId: string, data: any) => api.post(`/columns/${columnId}/cards`, data),
  updateCard: (id: string, data: any) => api.put(`/cards/${id}`, data),
  deleteCard: (id: string) => api.delete(`/cards/${id}`),
  moveCard: (id: string, data: any) => api.post(`/cards/${id}/move`, data),
};

export default api;