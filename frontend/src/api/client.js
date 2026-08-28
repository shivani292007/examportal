const BASE_URL = '/api';

export const apiClient = {
  getToken: () => localStorage.getItem('assessment_auth_token'),
  setToken: (token) => localStorage.setItem('assessment_auth_token', token),
  removeToken: () => localStorage.removeItem('assessment_auth_token'),

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized
      console.warn('Unauthorized access. Token may be expired.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network request failed' }));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    return response.json();
  },

  // Auth APIs
  register: (data) => apiClient.request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiClient.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => apiClient.request('/auth/me', { method: 'GET' }),

  // Assessment APIs
  startAssessment: (domain) => apiClient.request('/assessment/start', { method: 'POST', body: JSON.stringify({ domain }) }),
  getActiveSession: () => apiClient.request('/assessment/active', { method: 'GET' }),
  autoSaveAnswer: (data) => apiClient.request('/assessment/save-answer', { method: 'POST', body: JSON.stringify(data) }),
  submitAssessment: (data) => apiClient.request('/assessment/submit', { method: 'POST', body: JSON.stringify(data) }),

  // Code Runner
  runCode: (data) => apiClient.request('/code/run', { method: 'POST', body: JSON.stringify(data) }),

  // Integrity Logging
  logIntegrityEvent: (data) => apiClient.request('/integrity/log', { method: 'POST', body: JSON.stringify(data) }),
  getIntegrityStatus: (sessionId) => apiClient.request(`/integrity/status/${sessionId}`, { method: 'GET' }),

  // Results & Reports
  getReport: (sessionId) => apiClient.request(`/results/report/${sessionId}`, { method: 'GET' }),
};
