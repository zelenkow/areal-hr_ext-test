<template>
  <div class="audit-log-detail">
    <div class="header">
      <AppButton variant="primary" @click="goBack">← Назад к списку</AppButton>
    </div>

    <div class="log-header" v-if="log">
      <div class="meta">
        <div><strong>Дата:</strong> {{ formatDateWithTime(log.created_at) }}</div>
        <div><strong>Пользователь:</strong> {{ getUserName(log.user_id) }}</div>
      </div>
    </div>

    <div class="changes-section">
      <h2>Изменения</h2>

      <div class="changes-list">
        <div v-for="(change, idx) in filteredChanges" :key="idx" class="change-item">
          <div class="field-name">{{ change.field }}</div>
          <div class="change-content">
            <div class="old">
              <span class="label">Было:</span>
              <span class="value">{{ formatValue(change.old) }}</span>
            </div>
            <div class="new">
              <span class="label">Стало:</span>
              <span class="value">{{ formatValue(change.new) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuditLog, LogChange } from '@/types/audit-log'

import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'

import { formatDateWithTime, getUserName } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const logId = Number(route.params.id)

const log = ref<AuditLog | null>(null)
const changes = ref<LogChange[]>([])

onMounted(async () => {
  const logResponse = await fetch(`/api/audit-logs/${logId}`)
  log.value = await logResponse.json()

  const diffResponse = await fetch(`/api/audit-logs/${logId}/diff`)
  const diffData = await diffResponse.json()

  changes.value = diffData.changes || diffData || []
})

const filteredChanges = computed(() => {
  return changes.value.filter(change => {
    if (['id'].includes(change.field)) {
      return false
    }

    if (change.old === change.new) return false

    const oldEmpty = change.old == null || change.old === ''
    const newEmpty = change.new == null || change.new === ''
    if (oldEmpty && newEmpty) return false

    return true
  })
})

const goBack = () => {
  router.push('/audit_logs')
}

const formatValue = (value: unknown): string => {
  if (value == null) return '—'
  if (value === '') return 'Пусто'

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}
</script>

<style scoped>
.audit-log-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.log-header {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 30px;
}

.log-header h1 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.4em;
}

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  color: #666;
}

.changes-section {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 24px;
}

.changes-section h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-item {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
}

.field-name {
  font-weight: bold;
  margin-bottom: 10px;
  color: #444;
  font-size: 15px;
}

.change-content {
  display: flex;
  gap: 20px;
}

.old, .new {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
}

.old {
  background: #fff0f0;
  border: 1px solid #ffcdd2;
}

.new {
  background: #f0fff0;
  border: 1px solid #c8e6c9;
}

.label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.value {
  word-break: break-all;
  font-family: monospace;
}
</style>
