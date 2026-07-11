// lib/api/v2/eventManagers.service.ts
// Service for managing event managers

import apiClientV2 from '../client-v2';

export interface EventManager {
  id: string;
  eventId: string;
  userId: string;
  assignedById: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export interface AvailableOrganizer {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
}

interface ManagersResponse {
  status: string;
  data: EventManager[];
}

interface AvailableOrganizersResponse {
  status: string;
  data: AvailableOrganizer[];
}

interface AddManagerResponse {
  status: string;
  message: string;
  data: EventManager;
}

interface RemoveManagerResponse {
  status: string;
  message: string;
}

class EventManagersService {
  /**
   * Get all managers for an event
   */
  async getEventManagers(eventId: string): Promise<EventManager[]> {
    const response = await apiClientV2.get<ManagersResponse>(
      `/events/${eventId}/managers`
    );
    return response.data.data;
  }

  /**
   * Get available organizers to assign to an event
   */
  async getAvailableOrganizers(eventId: string): Promise<AvailableOrganizer[]> {
    const response = await apiClientV2.get<AvailableOrganizersResponse>(
      `/events/${eventId}/available-organizers`
    );
    return response.data.data;
  }

  /**
   * Add a manager to an event
   */
  async addManager(eventId: string, userId: string): Promise<EventManager> {
    const response = await apiClientV2.post<AddManagerResponse>(
      `/events/${eventId}/managers`,
      { userId }
    );
    return response.data.data;
  }

  /**
   * Remove a manager from an event
   */
  async removeManager(eventId: string, userId: string): Promise<void> {
    await apiClientV2.delete<RemoveManagerResponse>(
      `/events/${eventId}/managers/${userId}`
    );
  }
}

const eventManagersService = new EventManagersService();
export default eventManagersService;
