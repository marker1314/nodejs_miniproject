// User Types
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

// Study Types
export interface Study {
  id: number;
  title: string;
  description: string;
  category: string;
  region: string;
  maxMembers: number;
  membersCount?: number;
  deadline: string;
  leaderId?: number;
  leader?: {
    id: number;
    name: string;
  };
}

export interface CreateStudyRequest {
  title: string;
  description: string;
  category: string;
  region: string;
  maxMembers: number;
  deadline: string;
}

export interface UpdateStudyRequest {
  title?: string;
  description?: string;
  maxMembers?: number;
}

export interface StudyListResponse {
  data: Study[];
  total: number;
}

export interface StudyDetailResponse extends Study {
  applicants?: Application[];
}

// Application Types
export interface Application {
  id: number;
  studyId: number;
  userId: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface ApplyStudyRequest {
  message: string;
}

export interface ApplicantsResponse {
  applicants: Application[];
}

// Query Parameters
export interface StudyQueryParams {
  category?: string;
  region?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

