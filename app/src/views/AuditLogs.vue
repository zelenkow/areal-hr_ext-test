<template>
  <div class="audit-logs-container">
    <div class="header">
      <h1>Логи изменений</h1>
    </div>

    <DataTable v-if="logs.length" striped hover>
      <template #headers>
        <th>Дата и время</th>
        <th>Пользователь</th>
        <th>Сущность</th>
        <th>Действие</th>
      </template>

      <template #rows>
        <tr
          v-for="log in logs"
          :key="log.id"
          class="clickable-row"
          @click="openDetailView(log.id)"
        >
          <td>{{ formatDateWithTime(log.created_at) }}</td>
          <td>{{ getUserName(log.user_id) }}</td>
          <td>{{ getEntityLabel(log.entity_type) }}</td>
          <td>
            <span :class="`badge ${getActionInfo(log).class}`">
              {{ getActionInfo(log).text }}
            </span>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет логов для отображения</div>
  </div>
</template>

<script setup lang="ts">

import type { AuditLog } from '@/types/audit-log'

import { auditLogApi } from '@/services/audit-log-api'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from '@/components/DataTable.vue'

import { formatDateWithTime, getUserName, getEntityLabel } from '@/utils/helpers'

const router = useRouter()
const logs = ref<AuditLog[]>([])

onMounted(async () => {
  await loadLogs()
})

const loadLogs = async () => {
  logs.value = await auditLogApi.getLogs()
}

const openDetailView = (id: number) => {
  router.push(`/audit-logs/${id}`)
}

const getActionInfo = (log: AuditLog) => {
  if (!log.old_data && log.new_data) {
    return { class: 'create', text: 'Создание' }
  }

  if (log.old_data && log.new_data) {
    const wasDeleted = !log.old_data.deleted_at && log.new_data.deleted_at
    if (wasDeleted) {
      return { class: 'delete', text: 'Удаление' }
    }
  }

  return { class: 'update', text: 'Изменение' }
}

</script>

<style scoped>
.audit-logs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

</style>
