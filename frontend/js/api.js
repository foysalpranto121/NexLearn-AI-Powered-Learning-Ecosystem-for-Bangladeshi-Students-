const API_BASE = `${window.location.origin}/api/v1`;

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    let response = await fetch(url, config);

    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
        response = await fetch(url, { ...config, headers });
      } else {
        Auth.logout();
        throw new Error('Session expired. Please sign in again.');
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  async refreshToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return false;

      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem('accessToken', json.data.accessToken);
        localStorage.setItem('refreshToken', json.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient();
