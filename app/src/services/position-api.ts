import type { Position, CreatePositionDto, UpdatePositionDto } from '@/types/position'

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

  async createPosition(positionData: CreatePositionDto): Promise<Position> {
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

  async updatePosition(id: number, positionData: UpdatePositionDto): Promise<Position> {
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
