import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@/types/organization'

class OrganizationApi {
  private baseURL = '/api'

  async getOrganizations(): Promise<Organization[]> {
    const response = await fetch(`${this.baseURL}/organizations`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async getOrganizationById(id: number): Promise<Organization> {
    const response = await fetch(`${this.baseURL}/organizations/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async createOrganization(organizationData: CreateOrganizationDto): Promise<Organization> {
    const response = await fetch(`${this.baseURL}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organizationData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async updateOrganization(id: number, updateData: UpdateOrganizationDto): Promise<Organization> {
    const response = await fetch(`${this.baseURL}/organizations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async deleteOrganization(id: number): Promise<Organization> {
    const response = await fetch(`${this.baseURL}/organizations/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }
}
export const organizationApi = new OrganizationApi()
