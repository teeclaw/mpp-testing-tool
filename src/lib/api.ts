import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mpp-testing-tool-production.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TestResult {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  processingTime?: number;
  details?: string;
}

export interface DashboardStats {
  totalTests: number;
  successRate: number;
  avgProcessingTime: number;
}

export const api = {
  // Get dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalTests: 0,
        successRate: 0,
        avgProcessingTime: 0,
      };
    }
  },

  // Get recent test results
  getTestResults: async (limit: number = 10): Promise<TestResult[]> => {
    try {
      const response = await apiClient.get(`/test-results?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      return [];
    }
  },

  // Run a new test
  runTest: async (testName: string = 'Manual Test'): Promise<TestResult> => {
    try {
      const response = await apiClient.post('/run-test', { name: testName });
      return response.data;
    } catch (error) {
      console.error('Error running test:', error);
      throw error;
    }
  },

  // Get single test result
  getTestResult: async (id: string): Promise<TestResult> => {
    try {
      const response = await apiClient.get(`/test-results/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  },
};
