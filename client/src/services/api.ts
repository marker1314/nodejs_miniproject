import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Study,
  CreateStudyRequest,
  UpdateStudyRequest,
  StudyListResponse,
  StudyDetailResponse,
  ApplyStudyRequest,
  Application,
  ApplicantsResponse,
  StudyQueryParams,
} from '../types';

const BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Set Authorization header without Bearer prefix
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};

// Study API
export const studyAPI = {
  getStudies: async (params?: StudyQueryParams): Promise<StudyListResponse> => {
    const response = await api.get<StudyListResponse>('/studies', { params });
    return response.data;
  },

  getStudyById: async (studyId: number): Promise<StudyDetailResponse> => {
    const response = await api.get<StudyDetailResponse>(`/studies/${studyId}`);
    return response.data;
  },

  createStudy: async (data: CreateStudyRequest): Promise<Study> => {
    const response = await api.post<Study>('/studies', data);
    return response.data;
  },

  updateStudy: async (studyId: number, data: UpdateStudyRequest): Promise<void> => {
    await api.patch(`/studies/${studyId}`, data);
  },

  deleteStudy: async (studyId: number): Promise<void> => {
    await api.delete(`/studies/${studyId}`);
  },

  applyToStudy: async (studyId: number, data: ApplyStudyRequest): Promise<Application> => {
    const response = await api.post<Application>(`/studies/${studyId}/apply`, data);
    return response.data;
  },

  getApplicants: async (studyId: number): Promise<ApplicantsResponse> => {
    const response = await api.get<ApplicantsResponse>(`/studies/${studyId}/applicants`);
    return response.data;
  },

  approveApplicant: async (studyId: number, applyId: number): Promise<void> => {
    await api.patch(`/studies/${studyId}/applicants/${applyId}/approve`);
  },

  rejectApplicant: async (studyId: number, applyId: number): Promise<void> => {
    await api.patch(`/studies/${studyId}/applicants/${applyId}/reject`);
  },
};

// MyPage API
export const mypageAPI = {
  getMyAppliedStudies: async (): Promise<Study[]> => {
    const response = await api.get<Study[]>('/mypage/applied');
    return response.data;
  },

  getMyStudies: async (): Promise<Study[]> => {
    const response = await api.get<Study[]>('/mypage/studies');
    return response.data;
  },
};

export default api;

