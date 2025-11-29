interface Position {
  id?: number
  name: string
  created_at?: Date
  deleted_at?: Date
  updated_at?: Date
}

class PositionApi {
  private baseURL = '/api'

  async getPositions(): Promise<Position[]> {
    const response = await fetch(`${this.baseURL}/positions`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async getPositionById(id: number): Promise<Position> {
    const response = await fetch(`${this.baseURL}/positions/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async createPosition(positionData: Position): Promise<Position> {
    const response = await fetch(`${this.baseURL}/positions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(positionData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async updatePosition(id: number, positionData: Position): Promise<Position> {
    const response = await fetch(`${this.baseURL}/positions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(positionData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  async deletePosition(id: number): Promise<Position> {
    const response = await fetch(`${this.baseURL}/positions/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }
}

export const positionApi = new PositionApi()
export type { Position }
