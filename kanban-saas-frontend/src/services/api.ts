import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth Services ====================
export const authService = {
  login: (email: string, password: string) => 
    api.post('/login', { email, password }),
  
  register: (name: string, email: string, password: string, password_confirmation: string) => 
    api.post('/register', { name, email, password, password_confirmation }),
  
  logout: () => api.post('/logout'),
  
  getUser: () => api.get('/user'),
  
  updateProfile: (data: any) => api.put('/user', data),
  
  forgotPassword: (email: string) => api.post('/forgot-password', { email }),
  
  resetPassword: (data: any) => api.post('/reset-password', data),
};

// ==================== Teams Services ====================
export const teamsService = {
  getTeams: () => api.get('/teams'),
  
  getTeam: (id: string) => api.get(`/teams/${id}`),
  
  createTeam: (data: { name: string; description?: string }) => 
    api.post('/teams', data),
  
  updateTeam: (id: string, data: { name: string; description?: string }) => 
    api.put(`/teams/${id}`, data),
  
  deleteTeam: (id: string) => api.delete(`/teams/${id}`),
  
  inviteMember: (teamId: string, data: { email: string; role?: string }) => 
    api.post(`/teams/${teamId}/invite`, data),
  
  updateMember: (teamId: string, userId: string, data: { role: string }) => 
    api.post(`/teams/${teamId}/members/${userId}`, data),
  
  removeMember: (teamId: string, userId: string) => 
    api.delete(`/teams/${teamId}/members/${userId}`),
};

// ==================== Projects Services ====================
export const projectsService = {
  getProjects: (teamId: string) => 
    api.get('/projects', { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  getProject: (teamId: string, id: string) => 
    api.get(`/projects/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  createProject: (teamId: string, data: { name: string; description?: string }) => 
    api.post('/projects', data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  updateProject: (teamId: string, id: string, data: { name: string; description?: string }) => 
    api.put(`/projects/${id}`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  deleteProject: (teamId: string, id: string) => 
    api.delete(`/projects/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
};

// ==================== Boards Services ====================
export const boardsService = {
  getBoards: (teamId: string, projectId: string) => 
    api.get(`/projects/${projectId}/boards`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  getBoard: (teamId: string, projectId: string, id: string) => 
    api.get(`/projects/${projectId}/boards/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  createBoard: (teamId: string, projectId: string, data: { name: string }) => 
    api.post(`/projects/${projectId}/boards`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  updateBoard: (teamId: string, projectId: string, id: string, data: { name: string }) => 
    api.put(`/projects/${projectId}/boards/${id}`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  deleteBoard: (teamId: string, projectId: string, id: string) => 
    api.delete(`/projects/${projectId}/boards/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
};

// ==================== Columns Services ====================
export const columnsService = {
  getColumns: (teamId: string, boardId: string) => 
    api.get(`/boards/${boardId}/columns`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  createColumn: (teamId: string, boardId: string, data: { name: string; position?: number }) => 
    api.post(`/boards/${boardId}/columns`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  updateColumn: (teamId: string, boardId: string, id: string, data: { name?: string; position?: number }) => 
    api.put(`/boards/${boardId}/columns/${id}`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  deleteColumn: (teamId: string, boardId: string, id: string) => 
    api.delete(`/boards/${boardId}/columns/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
};

// ==================== Cards Services ====================
export const cardsService = {
  getCards: (teamId: string, columnId: string) => 
    api.get(`/columns/${columnId}/cards`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  getCard: (teamId: string, columnId: string, id: string) => 
    api.get(`/columns/${columnId}/cards/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  createCard: (teamId: string, columnId: string, data: { 
    title: string; 
    description?: string;
    due_date?: string;
    assigned_to?: string;
    priority?: string;
    labels?: string[];
  }) => 
    api.post(`/columns/${columnId}/cards`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  updateCard: (teamId: string, columnId: string, id: string, data: {
    title?: string;
    description?: string;
    due_date?: string;
    assigned_to?: string;
    priority?: string;
    labels?: string[];
  }) => 
    api.put(`/columns/${columnId}/cards/${id}`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  deleteCard: (teamId: string, columnId: string, id: string) => 
    api.delete(`/columns/${columnId}/cards/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  moveCard: (teamId: string, id: string, data: { 
    column_id: string; 
    position: number 
  }) => 
    api.post(`/cards/${id}/move`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
};

// ==================== Comments Services ====================
export const commentsService = {
  getComments: (teamId: string, cardId: string) => 
    api.get(`/cards/${cardId}/comments`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  createComment: (teamId: string, cardId: string, data: { content: string }) => 
    api.post(`/cards/${cardId}/comments`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  updateComment: (teamId: string, cardId: string, id: string, data: { content: string }) => 
    api.put(`/cards/${cardId}/comments/${id}`, data, { 
      headers: { 'X-Team-Id': teamId } 
    }),
  
  deleteComment: (teamId: string, cardId: string, id: string) => 
    api.delete(`/cards/${cardId}/comments/${id}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
};

// ==================== Files/Attachments Services ====================
export const filesService = {
  uploadAttachment: (teamId: string, cardId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/cards/${cardId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Team-Id': teamId,
      },
    });
  },
  
  deleteAttachment: (teamId: string, attachmentId: string) => 
    api.delete(`/attachments/${attachmentId}`, { 
      headers: { 'X-Team-Id': teamId } 
    }),
};

export default api;
