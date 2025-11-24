import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface Organization {
  id?: number
  name: string
  comment?: string
}

export interface Department {
  id?: number
  name: string
  organizationId: number
  parentId?: number | null
  comment?: string
}

export interface Position {
  id?: number
  name: string
  comment?: string
}

export const organizationsAPI = {
  getAll: () => api.get<Organization[]>('/organizations'),
  getById: (id: number) => api.get<Organization>(`/organizations/${id}`),
  create: (data: Omit<Organization, 'id'>) => api.post<Organization>('/organizations', data),
  update: (id: number, data: Partial<Organization>) => api.patch<Organization>(`/organizations/${id}`, data),
  delete: (id: number) => api.delete<void>(`/organizations/${id}`)
}

export const departmentsAPI = {
  getAll: () => api.get<Department[]>('/departments'),
  getByOrganization: (orgId: number) => api.get<Department[]>(`/departments/organization/${orgId}`),
  getById: (id: number) => api.get<Department>(`/departments/${id}`),
  create: (data: Omit<Department, 'id'>) => api.post<Department>('/departments', data), 
  update: (id: number, data: Partial<Department>) => api.patch<Department>(`/departments/${id}`, data),
  delete: (id: number) => api.delete<void>(`/departments/${id}`)
}

export const positionsAPI = {
  getAll: () => api.get<Position[]>('/positions'),
  getById: (id: number) => api.get<Position>(`/positions/${id}`),
  create: (data: Omit<Position, 'id'>) => api.post<Position>('/positions', data),
  update: (id: number, data: Partial<Position>) => api.patch<Position>(`/positions/${id}`, data),
  delete: (id: number) => api.delete<void>(`/positions/${id}`)
}
