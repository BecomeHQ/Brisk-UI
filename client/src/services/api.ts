const API_BASE_URL = "http://localhost:5000/api";

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        data: null as T,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Leave-related API calls
  async getEmployeesOnLeaveToday(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>("/leaves/today");
  }

  async getEmployeesOnLeaveNextWeek(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>("/leaves/next-week");
  }

  async getPendingLeaveRequests(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/leaves/status/Pending");
  }

  async getAllLeaveRequests(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/leaves");
  }

  async getPendingLeaveRequestsCount(): Promise<ApiResponse<number>> {
    const response = await this.request<any[]>("/leaves/status/Pending");
    return {
      data: response.data?.length || 0,
      error: response.error,
    };
  }

  // User-related API calls
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/users");
  }

  async getSlackUsers(): Promise<ApiResponse<{ users: any[] }>> {
    return this.request<{ users: any[] }>("/users/slack/users");
  }

  async createUser(userData: {
    username: string;
    slackId: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getAllEmployees(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/users");
  }

  async getUserById(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${id}`);
  }

  // Attendance-related API calls
  async getAttendanceByDate(date: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/attendance/date/${date}`);
  }

  async getAttendanceByUser(user: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/attendance/user/${user}`);
  }

  async getTodayAttendanceStats(): Promise<ApiResponse<any>> {
    return this.request<any>("/attendance/today");
  }
}

export const apiService = new ApiService();
export default apiService;
