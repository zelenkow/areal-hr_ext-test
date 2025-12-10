<template>
  <div class="personal-tab">
    <div class="data-section">
      <h2>Основные данные</h2>
      <div class="data-grid">
        <div class="data-row">
          <span class="label">Фамилия:</span>
          <span class="value">{{ employee.last_name }}</span>
        </div>
        <div class="data-row">
          <span class="label">Имя:</span>
          <span class="value">{{ employee.first_name }}</span>
        </div>
        <div class="data-row">
          <span class="label">Отчество:</span>
          <span class="value">{{ employee.middle_name }}</span>
        </div>
        <div class="data-row">
          <span class="label">Дата рождения:</span>
          <span class="value">{{ employee.birth_date }}</span>
        </div>
      </div>
    </div>

    <div class="data-section">
      <h2>Паспортные данные</h2>
      <div v-if="hasPassportData" class="data-grid">
        <div class="data-row">
          <span class="label">Серия:</span>
          <span class="value">{{ employee.passport_series }}</span>
        </div>
        <div class="data-row">
          <span class="label">Номер:</span>
          <span class="value">{{ employee.passport_number }}</span>
        </div>
        <div class="data-row">
          <span class="label">Код подразделения:</span>
          <span class="value">{{ employee.passport_issue_code }}</span>
        </div>
        <div class="data-row">
          <span class="label">Дата выдачи:</span>
          <span class="value">{{ employee.passport_issue_date }}</span>
        </div>
        <div class="data-row">
          <span class="label">Кем выдан:</span>
          <span class="value">{{ employee.passport_issued_by }}</span>
        </div>
      </div>
      <div v-else class="empty-section">
        <p>Паспортные данные не заполнены</p>
      </div>
    </div>

    <div class="data-section">
      <h2>Адрес регистрации</h2>
      <div v-if="hasAddressData" class="data-grid">
        <div class="data-row">
          <span class="label">Область:</span>
          <span class="value">{{ employee.registration_region }}</span>
        </div>
        <div class="data-row">
          <span class="label">Населенный пункт:</span>
          <span class="value">{{ employee.registration_city }}</span>
        </div>
        <div class="data-row">
          <span class="label">Улица:</span>
          <span class="value">{{ employee.registration_street }}</span>
        </div>
        <div class="data-row data-row-compact"></div>
        <div class="data-row">
          <span class="label">Дом:</span>
          <span class="value">{{ employee.registration_house }}</span>
        </div>
        <div class="data-row">
          <span class="label">Корпус:</span>
          <span class="value">{{ display(employee.registration_building) }}</span>
        </div>
        <div class="data-row">
          <span class="label">Квартира:</span>
          <span class="value">{{ display(employee.registration_apartment) }}</span>
        </div>
      </div>
      <div v-else class="empty-section">
        <p>Адрес регистрации не заполнен</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from '@/types/employee'
import { computed } from 'vue'

interface Props {
  employee: Employee
}

const props = defineProps<Props>()

const display = (value: string): string => {
  return value.trim() || '—'
}

const hasPassportData = computed(() => {
  return !!(
    props.employee.passport_series ||
    props.employee.passport_number ||
    props.employee.passport_issue_code ||
    props.employee.passport_issue_date ||
    props.employee.passport_issued_by
  )
})

const hasAddressData = computed(() => {
  return !!(
    props.employee.registration_region ||
    props.employee.registration_city ||
    props.employee.registration_street ||
    props.employee.registration_house ||
    props.employee.registration_building ||
    props.employee.registration_apartment
  )
})
</script>

<style scoped>
.personal-tab {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.data-section {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 24px;
}

.data-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.data-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-row {
  display: flex;
}

.label {
  flex: 0 0 200px;
  font-weight: 600;
  color: #495057;
}

.value {
  flex: 1;
  color: #212529;
}

.empty-section {
  text-align: center;
  padding: 30px;
  color: #6c757d;
}
</style>
