// types/user-competition.ts

export enum UserCompetitionStatus {
  INTERESTED = 'INTERESTED',
  REGISTERED = 'REGISTERED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  DNF = 'DNF',
  DNS = 'DNS',
}

export interface UserCompetition {
  id: string;
  userId: string;
  competitionId: string;
  status: UserCompetitionStatus;
  
  // Resultados personales
  finishTime?: string;
  finishTimeSeconds?: number;
  position?: number;
  categoryPosition?: number;
  
  // Notas personales
  notes?: string;
  personalRating?: number; // 1-5
  
  // Fechas
  markedAt: string;
  completedAt?: string;
  updatedAt: string;
  
  // Relación con competición
  competition: {
    id: string;
    slug: string;
    name: string;
    type: string;
    startDate: string;
    endDate?: string;
    city: string;
    country: string;
    distance?: number;
    elevation?: number;
    registrationStatus: string;
    _count?: {
      participants: number;
      reviews: number;
    };
  };
}

export interface UserStats {
  totalCompetitions: number;
  byStatus: {
    interested: number;
    registered: number;
    confirmed: number;
    completed: number;
    dnf: number;
    dns: number;
  };
  completedStats: {
    totalCompleted: number;
    totalKm: number;
    totalElevation: number;
    averageTime?: string;
    fastestRace?: {
      competitionId: string;
      name: string;
      time: string;
      timeSeconds: number;
    };
  };
}

export interface MarkCompetitionData {
  status: UserCompetitionStatus;
}

export interface AddResultData {
  finishTime?: string;
  position?: number;
  categoryPosition?: number;
  notes?: string;
  personalRating?: number;
  completedAt?: string;
}

export interface UpdateUserCompetitionData {
  status?: UserCompetitionStatus;
  finishTime?: string;
  position?: number;
  categoryPosition?: number;
  notes?: string;
  personalRating?: number;
  completedAt?: string;
}

export interface RankingEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    name: string;
    country?: string;
  };
  count: number;
}
