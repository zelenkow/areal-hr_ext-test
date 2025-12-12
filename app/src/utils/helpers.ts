export const getEmployeeStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    NOT_HIRED: 'Не нанят',
    ACTIVE: 'Работает',
    DISMISSED: 'Уволен',
  }
  return statusMap[status] || status
}

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('ru-RU')
}
