export const getEmployeeStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    NOT_HIRED: 'Не нанят',
    ACTIVE: 'Работает',
    DISMISSED: 'Уволен',
  }
  return statusMap[status] || status
}

export const getEntityLabel = (entityType: string) => {
  const labels: Record<string, string> = {
    'files': 'Документ',
    'users': 'Пользователь',
    'employees': 'Сотрудник',
    'organizations': 'Организация',
    'departments': 'Отдел',
    'positions': 'Должность',
    'hr-operations': 'Кадровая операция'
  }
  return labels[entityType] || entityType
}

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('ru-RU')
}

export const formatDateWithTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('ru-RU')
}

export const getUserName = (userId: number) => {
  return `ID: ${userId}`
}
