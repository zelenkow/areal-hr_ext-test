import type {
  User,
  CreateUserDto,
  UpdateUserDto,
} from '@/types/user'
import { api } from '@/services/Api'

export const userApi = {
  getUsers() {
    return api.get<User[]>('/users')
  },

  getUserById(id: number) {
    return api.get<User>(`/users/${id}`)
  },

  createUser(dto: CreateUserDto) {
    return api.post<User, CreateUserDto>('/users', dto)
  },

  updateUser(id: number, dto: UpdateUserDto) {
    return api.patch<User, UpdateUserDto>(`/users/${id}`, dto)
  },

  deleteUser(id: number) {
    return api.delete<User>(`/users/${id}`)
  },
}
