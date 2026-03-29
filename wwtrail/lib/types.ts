// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Competition Types
export interface Competition {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  distance: number;
  elevationGain: number;
  organizerId: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionFilters {
  search?: string;
  location?: string;
  difficulty?: string;
  minDistance?: number;
  maxDistance?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  limit?: number;
  page?: number;
}

// Registration Types
export interface Registration {
  id: string;
  userId: string;
  competitionId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  registrationDate: string;
  bib: number;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
