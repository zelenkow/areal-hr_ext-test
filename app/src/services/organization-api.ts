interface Organization {
  id?: number
  name: string
  comment?: string
  created_at?: Date
  deleted_at?: Date
  updated_at?: Date
}

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

  async createOrganization(organizationData: Organization): Promise<Organization> {
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

  async updateOrganization(id: number, organizationData: Organization): Promise<Organization> {
    const response = await fetch(`${this.baseURL}/organizations/${id}`, {
      method: 'PATCH',
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
export type { Organization }
