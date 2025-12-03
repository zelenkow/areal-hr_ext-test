import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/types/department'

class DepartmentApi {
  private baseURL = '/api'

  async getDepartments(): Promise<Department[]> {
    const response = await fetch(`${this.baseURL}/departments`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async getDepartmentById(id: number): Promise<Department> {
    const response = await fetch(`${this.baseURL}/departments/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async createDepartment(departmentData: CreateDepartmentDto): Promise<Department> {
    const response = await fetch(`${this.baseURL}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async updateDepartment(id: number, departmentData: UpdateDepartmentDto): Promise<Department> {
    const response = await fetch(`${this.baseURL}/departments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async deleteDepartment(id: number): Promise<Department> {
    const response = await fetch(`${this.baseURL}/departments/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }
}

export const departmentApi = new DepartmentApi()
