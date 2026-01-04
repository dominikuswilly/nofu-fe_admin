interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Terjadi kesalahan sistem' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
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
    const response = await fetch(finalUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...rest.headers,
      },
      ...rest,
    });
    return handleResponse(response);
  },

  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  }
};
