const API_BASE = '/admin';

export const mockApi = {
  async getAllMocks() {
    const response = await fetch(`${API_BASE}/mocks`);
    if (!response.ok) throw new Error('Failed to fetch mocks');
    return response.json();
  },

  async getMock(id: string) {
    const response = await fetch(`${API_BASE}/mocks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch mock');
    return response.json();
  },

  async createMock(mockData: any) {
    const response = await fetch(`${API_BASE}/mocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create mock');
    }
    return response.json();
  },

  async updateMock(id: string, mockData: any) {
    const response = await fetch(`${API_BASE}/mocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update mock');
    }
    return response.json();
  },

  async deleteMock(id: string) {
    const response = await fetch(`${API_BASE}/mocks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete mock');
    return response.json();
  },

  async getRequestLogs(limit = 100) {
    const response = await fetch(`${API_BASE}/logs?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  },

  async clearLogs() {
    const response = await fetch(`${API_BASE}/logs`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear logs');
    return response.json();
  },

  async testEndpoint(testData: any) {
    const response = await fetch(`${API_BASE}/test-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    if (!response.ok) throw new Error('Failed to test endpoint');
    return response.json();
  },
};