import axios from 'axios'

export interface Organization {
  id?: number
  name: string
  comment?: string
}

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const organizationsAPI = {
  getAll: () => api.get<Organization[]>('/organizations'),
  getById: (id: number) => api.get<Organization>(`/organizations/${id}`),
  create: (data: Organization) => api.post<Organization>('/organizations', data),
  update: (id: number, data: Partial<Organization>) => api.patch<Organization>(`/organizations/${id}`, data),
  delete: (id: number) => api.delete(`/organizations/${id}`)
}