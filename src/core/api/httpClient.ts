interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

const handleResponse = async (response: Response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || data.responseMessage || `Error ${response.status}: ${response.statusText}`);
  }

  return data;
};

export const httpClient = {
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...rest } = options;
    const finalUrl = new URL(url);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          finalUrl.searchParams.append(key, value);
        }
      });
    }

    const token = localStorage.getItem('token');
    const response = await fetch(finalUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...rest.headers,
      },
      ...rest,
    });
    return handleResponse(response);
  },

  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async patch<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  }
};
