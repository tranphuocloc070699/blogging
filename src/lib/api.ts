

// We'll need to get the auth context outside of React components
// This will be set by the auth context
let globalAccessToken: string | null = null;
let globalRefreshFunction: (() => Promise<boolean>) | null = null;

export function setGlobalAuth(token: string | null, refreshFn: (() => Promise<boolean>) | null) {
  globalAccessToken = token;
  globalRefreshFunction = refreshFn;
}

// Generic API request function
async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = async (token: string | null) => {
    const response = await fetch(`/api${endpoint}`, {
      credentials: 'include', // Include cookies for refresh token
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Handle unauthorized requests
      if (response.status === 401 && globalRefreshFunction) {
        // Try to refresh token
        const refreshSuccess = await globalRefreshFunction();
        if (refreshSuccess && globalAccessToken) {
          // Retry request with new token
          return fetch(`/api${endpoint}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${globalAccessToken}`,
              ...options.headers,
            },
            ...options,
          });
        } else {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response;
  };

  const response = await makeRequest(globalAccessToken);
  const data = await response.json();
  return data.data || data;
}

// Taxonomy API calls
export const taxonomyApi = {
  getAll: () => apiRequest('/taxonomies'),
  getById: (id: number) => apiRequest(`/taxonomies/${id}`),
  create: (data: any) => apiRequest('/taxonomies', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/taxonomies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/taxonomies/${id}`, {
    method: 'DELETE',
  }),
};

// Term API calls
export const termApi = {
  getAll: () => apiRequest('/terms'),
  getById: (id: number) => apiRequest(`/terms/${id}`),
  getByTaxonomyId: (taxonomyId: number) => apiRequest(`/terms/taxonomy/${taxonomyId}`),
  create: (data: any) => apiRequest('/terms', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/terms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/terms/${id}`, {
    method: 'DELETE',
  }),
};

// Posts API calls
export const postApi = {
  getAll: () => apiRequest('/posts'),
  getById: (id: number) => apiRequest(`/posts/${id}`),
  create: (data: any) => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/posts/${id}`, {
    method: 'DELETE',
  }),
};