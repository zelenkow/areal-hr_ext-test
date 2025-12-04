class ApiClient {
  private baseURL = '/api'

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<Response, Request>(endpoint: string, data: Request): Promise<Response> {
    return this.request<Response>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  patch<Response, Request>(endpoint: string, data: Request): Promise<Response> {
    return this.request<Response>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}
export const api = new ApiClient()
