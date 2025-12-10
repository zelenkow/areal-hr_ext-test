import type { FileEntity, CreateFileDto } from '@/types/file'

export const fileApi = {
  async getEmployeeFiles(employeeId: number): Promise<FileEntity[]> {
    const response = await fetch(`/api/files/employee/${employeeId}`)
    if (!response.ok) throw new Error('Failed to fetch files')
    return response.json()
  },

  async uploadFile(dto: CreateFileDto, file: globalThis.File): Promise<FileEntity> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('employee_id', dto.employee_id.toString())
    formData.append('name', dto.name)

    const response = await fetch('/api/files', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Upload failed: ${error}`)
    }
    return response.json()
  },

  async downloadFile(fileId: number): Promise<Blob> {
    const response = await fetch(`/api/files/${fileId}/download`)
    if (!response.ok) throw new Error('Download failed')
    return response.blob()
  },

  async deleteFile(fileId: number): Promise<void> {
    const response = await fetch(`/api/files/${fileId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Delete failed')
  },
}
