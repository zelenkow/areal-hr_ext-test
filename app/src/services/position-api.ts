import type { Position, CreatePositionDto, UpdatePositionDto } from '@/types/position'
import { api } from '@/services/Api'

export const positionApi = {
  getPositions() {
    return api.get<Position[]>('/positions')
  },

  getPositionById(id: number) {
    return api.get<Position>(`/positions/${id}`)
  },

  createPosition(dto: CreatePositionDto) {
    return api.post<Position, CreatePositionDto>('/positions', dto)
  },

  updatePosition(id: number, dto: UpdatePositionDto) {
    return api.patch<Position, UpdatePositionDto>(`/positions/${id}`, dto)
  },

  deletePosition(id: number) {
    return api.delete<Position>(`/positions/${id}`)
  },
}
