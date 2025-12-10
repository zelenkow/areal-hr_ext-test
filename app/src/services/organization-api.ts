import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@/types/organization'
import { api } from '@/services/Api'

export const organizationApi = {
  getOrganizations() {
    return api.get<Organization[]>('/organizations')
  },

  getOrganizationById(id: number) {
    return api.get<Organization>(`/organizations/${id}`)
  },

  createOrganization(dto: CreateOrganizationDto) {
    return api.post<Organization, CreateOrganizationDto>('/organizations', dto)
  },

  updateOrganization(id: number, dto: UpdateOrganizationDto) {
    return api.patch<Organization, UpdateOrganizationDto>(`/organizations/${id}`, dto)
  },

  deleteOrganization(id: number) {
    return api.delete<Organization>(`/organizations/${id}`)
  },
}
