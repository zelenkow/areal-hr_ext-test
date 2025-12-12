<template>
  <div class="operations-tab">
    <div class="operations-header">
      <h2>История кадровых операций</h2>
      <AppButton variant="primary" @click="openCreateModal"> Новая операция </AppButton>
    </div>

    <div v-if="currentEmployee" class="employee-state-compact">
      <div class="state-badge" :class="getEmployeeStatusClass(currentEmployee.hr_status)">
        {{ getEmployeeStatusText(currentEmployee.hr_status) }}
      </div>
      <div class="state-info">
        <span>{{ getDepartmentName(currentEmployee.current_department_id) }}</span>
        <span class="divider">•</span>
        <span>{{ getPositionName(currentEmployee.current_position_id) }}</span>
        <span class="divider">•</span>
        <span>{{ formatSalary(currentEmployee.current_salary) }}</span>
      </div>
    </div>

    <DataTable v-if="hrOperations.length" striped hover>
      <template #headers>
        <th style="width: 25%">Тип операции</th>
        <th style="width: 20%">Отдел</th>
        <th style="width: 20%">Должность</th>
        <th style="width: 20%">Зарплата</th>
        <th style="width: 15%">Дата</th>
      </template>

      <template #rows>
        <tr v-for="operation in hrOperations" :key="operation.id">
          <td>{{ getOperationTypeText(operation.type) }}</td>
          <td>{{ getDepartmentName(operation.department_id) }}</td>
          <td>{{ getPositionName(operation.position_id) }}</td>
          <td>{{ formatSalary(operation.salary) }}</td>
          <td>{{ formatDate(operation.created_at) }}</td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет кадровых операций для отображения</div>

    <FormModal
      :show="showCreateModal"
      title="Создание кадровой операции"
      submit-text="Создать"
      @submit="createOperation"
      @cancel="closeCreateModal"
    >
      <div class="form-group">
        <label>Тип операции:</label>
        <select v-model="newOperation.type" :class="{ error: showTypeError && !newOperation.type }">
          <option value="">Выберите тип</option>
          <option value="hire">Приём на работу</option>
          <option value="transfer">Перевод</option>
          <option value="salary_change">Изменение зарплаты</option>
          <option value="dismissal">Увольнение</option>
        </select>
        <span v-if="showTypeError && !newOperation.type" class="error-text">
          Выберите тип операции
        </span>
      </div>

      <div v-if="showDepartmentField" class="form-group">
        <label>Отдел:</label>
        <select
          v-model="newOperation.department_id"
          :class="{ error: showDepartmentError && !newOperation.department_id }"
        >
          <option value="">Выберите отдел</option>
          <option v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>
        <span v-if="showDepartmentError && !newOperation.department_id" class="error-text">
          Выберите отдел
        </span>
      </div>

      <div v-if="showPositionField" class="form-group">
        <label>Должность:</label>
        <select
          v-model="newOperation.position_id"
          :class="{ error: showPositionError && !newOperation.position_id }"
        >
          <option value="">Выберите должность</option>
          <option v-for="position in positions" :key="position.id" :value="position.id">
            {{ position.name }}
          </option>
        </select>
        <span v-if="showPositionError && !newOperation.position_id" class="error-text">
          Выберите должность
        </span>
      </div>

      <div v-if="showSalaryField" class="form-group">
        <label>Зарплата (₽):</label>
        <input
          type="number"
          v-model.number="newOperation.salary"
          :class="{ error: showSalaryError && !newOperation.salary }"
          placeholder="Введите сумму"
          min="0"
        />
        <span v-if="showSalaryError && !newOperation.salary" class="error-text">
          Зарплата обязательна
        </span>
      </div>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import type { HrOperation, CreateHrOperationDto } from '@/types/hr-operation'
import type { Department } from '@/types/department'
import type { Position } from '@/types/position'
import type { EmployeeState } from '@/types/employee'

import { getEmployeeStatusText, formatDate } from '@/utils/helpers'

import { hrOperationApi } from '@/services/hr-operation-api'
import { departmentApi } from '@/services/department-api'
import { positionApi } from '@/services/position-api'
import { employeeApi } from '@/services/employee-api'

import AppButton from '@/components/AppButton.vue'
import FormModal from '@/components/FormModal.vue'
import DataTable from '@/components/DataTable.vue'

import { ref, computed, onMounted } from 'vue'

interface Props {
  employeeId: number
}

const props = defineProps<Props>()

const showCreateModal = ref(false)

const showTypeError = ref(false)
const showDepartmentError = ref(false)
const showPositionError = ref(false)
const showSalaryError = ref(false)

const hrOperations = ref<HrOperation[]>([])
const departments = ref<Department[]>([])
const positions = ref<Position[]>([])
const currentEmployee = ref<EmployeeState | null>(null)

const newOperation = ref<CreateHrOperationDto>({
  employee_id: props.employeeId,
  type: '',
  department_id: null,
  position_id: null,
  salary: null,
})

const originalValues = ref<CreateHrOperationDto>({
  employee_id: props.employeeId,
  type: '',
  department_id: null,
  position_id: null,
  salary: null,
})

onMounted(async () => {
  await loadData()
  await loadReferenceData()
  await loadCurrentEmployee()
})

const loadData = async () => {
  hrOperations.value = await hrOperationApi.getEmployeeOperations(props.employeeId)
}

const loadReferenceData = async () => {
  departments.value = await departmentApi.getDepartments()
  positions.value = await positionApi.getPositions()
}

const loadCurrentEmployee = async () => {
  currentEmployee.value = await employeeApi.getEmployeeById(props.employeeId)
}

const showDepartmentField = computed(() => {
  return ['hire', 'transfer'].includes(newOperation.value.type)
})

const showPositionField = computed(() => {
  return ['hire'].includes(newOperation.value.type)
})

const showSalaryField = computed(() => {
  return ['hire', 'salary_change'].includes(newOperation.value.type)
})

const openCreateModal = async () => {
  const employee = await employeeApi.getEmployeeById(props.employeeId)

  originalValues.value = {
    employee_id: props.employeeId,
    type: '',
    department_id: employee.current_department_id,
    position_id: employee.current_position_id,
    salary: employee.current_salary,
  }

  newOperation.value = {
    employee_id: props.employeeId,
    type: '',
    department_id: employee.current_department_id,
    position_id: employee.current_position_id,
    salary: employee.current_salary,
  }

  showCreateModal.value = true
}

const createOperation = async () => {
  if (!validateOperation()) {
    return
  }

  const dataToSend = buildOperationData()

  if (!dataToSend) {
    resetNewForm()
    closeCreateModal()
    return
  }

  await hrOperationApi.createOperation(dataToSend)

  await loadData()
  await loadCurrentEmployee()
  resetNewForm()
  closeCreateModal()
}

const validateOperation = (): boolean => {
  let isValid = true

  if (!newOperation.value.type) {
    showTypeError.value = true
    isValid = false
  }

  switch (newOperation.value.type) {
    case 'hire':
      if (!newOperation.value.department_id || newOperation.value.department_id <= 0) {
        showDepartmentError.value = true
        isValid = false
      }
      if (!newOperation.value.position_id || newOperation.value.position_id <= 0) {
        showPositionError.value = true
        isValid = false
      }
      if (!newOperation.value.salary || newOperation.value.salary <= 0) {
        showSalaryError.value = true
        isValid = false
      }
      break

    case 'transfer':
      if (!newOperation.value.department_id || newOperation.value.department_id <= 0) {
        showDepartmentError.value = true
        isValid = false
      }
      break

    case 'salary_change':
      if (!newOperation.value.salary || newOperation.value.salary <= 0) {
        showSalaryError.value = true
        isValid = false
      }
      break
  }

  return isValid
}

const buildOperationData = (): CreateHrOperationDto | null => {
  const dataToSend: CreateHrOperationDto = {
    employee_id: props.employeeId,
    type: newOperation.value.type,
  } as CreateHrOperationDto

  let shouldSend = true

  if (newOperation.value.type === 'hire') {
    dataToSend.department_id = newOperation.value.department_id
    dataToSend.position_id = newOperation.value.position_id
    dataToSend.salary = newOperation.value.salary
    shouldSend = true
  }

  if (newOperation.value.type === 'transfer') {
    const departmentChanged =
      newOperation.value.department_id !== originalValues.value.department_id

    if (departmentChanged) {
      dataToSend.department_id = newOperation.value.department_id
    }
    shouldSend = departmentChanged
  }

  if (newOperation.value.type === 'salary_change') {
    const salaryChanged = newOperation.value.salary !== originalValues.value.salary

    if (salaryChanged) {
      dataToSend.salary = newOperation.value.salary
    }
    shouldSend = salaryChanged
  }

  return shouldSend ? dataToSend : null
}

const closeCreateModal = () => {
  showCreateModal.value = false
  resetNewForm()
}

const resetNewForm = () => {
  newOperation.value = {
    employee_id: props.employeeId,
    type: '',
    department_id: null,
    position_id: null,
    salary: null,
  }
  showTypeError.value = false
  showDepartmentError.value = false
  showPositionError.value = false
  showSalaryError.value = false
}

const getOperationTypeText = (type: string): string => {
  const types: Record<string, string> = {
    hire: 'Приём на работу',
    transfer: 'Перевод',
    salary_change: 'Изменение зарплаты',
    dismissal: 'Увольнение',
  }
  return types[type] || type
}

const getDepartmentName = (id: number | null): string => {
  if (!id) return '-'
  const department = departments.value.find((d) => d.id === id)
  return department?.name || `Отдел #${id}`
}

const getPositionName = (id: number | null): string => {
  if (!id) return '-'
  const position = positions.value.find((p) => p.id === id)
  return position?.name || `Должность #${id}`
}

const formatSalary = (salary: number | null): string => {
  return salary ? `${salary.toLocaleString('ru-RU')} ₽` : '-'
}

const getEmployeeStatusClass = (status: string): string => {
  return `status-${status.toLowerCase()}`
}
</script>

<style scoped>
.operations-tab {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.operations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.operations-header h2 {
  color: #2c3e50;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  white-space: normal;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error {
  border-color: #e74c3c !important;
}

.error-text {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-group input::placeholder,
.form-group select::placeholder {
  color: #a0a0a0;
  font-style: italic;
  opacity: 0.8;
}

:deep(.data-table td) {
  overflow-wrap: break-word;
  white-space: normal;
}

.employee-state-compact {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.state-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.state-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.divider {
  color: #6c757d;
}

.status-not_hired {
  background-color: #e9ecef;
  color: #6c757d;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-dismissed {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
