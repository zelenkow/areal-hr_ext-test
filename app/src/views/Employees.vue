<template>
  <div class="employees-container">
    <div class="header">
      <h1>Сотрудники</h1>
      <AppButton variant="primary" @click="openCreateModal">
        Добавить сотрудника
      </AppButton>
    </div>

    <DataTable v-if="employees.length" striped hover>
      <template #headers>
        <th>ФИО</th>
        <th>Дата рождения</th>
      </template>

      <template #rows>
        <tr
          v-for="employee in employees"
          :key="employee.id"
          class="clickable-row"
          @click="openDetailView(employee.id)"
        >
          <td>{{ formatFullName(employee) }}</td>
          <td>{{ employee.birth_date }}</td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет сотрудников для отображения</div>

    <FormModal
      :show="showCreateModal"
      title="Создание сотрудника"
      submit-text="Создать"
      @submit="createEmployee"
      @cancel="closeCreateModal"
    >
      <div class="form-group">
        <label>Фамилия:</label>
        <input
          type="text"
          v-model="newEmployee.last_name"
          :class="{ error: showLastNameError && !newEmployee.last_name.trim() }"
          placeholder="Введите фамилию"
        />
        <span v-if="showLastNameError && !newEmployee.last_name.trim()" class="error-text">
          Фамилия обязательна
        </span>
      </div>
      <div class="form-group">
        <label>Имя:</label>
        <input
          type="text"
          v-model="newEmployee.first_name"
          :class="{ error: showFirstNameError && !newEmployee.first_name.trim() }"
          placeholder="Введите имя"
        />
        <span v-if="showFirstNameError && !newEmployee.first_name.trim()" class="error-text">
          Имя обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Отчество:</label>
        <input
          type="text"
          v-model="newEmployee.middle_name"
          :class="{ error: showMiddleNameError && !newEmployee.middle_name.trim() }"
          placeholder="Введите отчество"
        />
        <span v-if="showMiddleNameError && !newEmployee.middle_name.trim()" class="error-text">
          Отчество обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Дата рождения:</label>
        <input
          type="text"
          v-model="newEmployee.birth_date"
          :class="{ error: showBirthDateError && !newEmployee.birth_date }"
          placeholder="Введите дату в формате дд.мм.гггг"
        />
        <span v-if="showBirthDateError && !newEmployee.birth_date" class="error-text">
          Дата рождения обязательна
        </span>
      </div>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import type { Employee, CreateEmployeeDto } from '@/types/employee'
import { employeeApi } from '@/services/employee-api'
import { formatFullName } from '@/utils/formatters'
import FormModal from '@/components/FormModal.vue'
import AppButton from '@/components/AppButton.vue'
import DataTable from '@/components/DataTable.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showCreateModal = ref(false)

const showLastNameError = ref(false)
const showFirstNameError = ref(false)
const showMiddleNameError = ref(false)
const showBirthDateError = ref(false)

const employees = ref<Employee[]>([])

const newEmployee = ref<CreateEmployeeDto>({
  last_name: '',
  first_name: '',
  middle_name: '',
  birth_date: '',
  passport_series: '',
  passport_number: '',
  passport_issue_date: '',
  passport_issue_code: '',
  passport_issued_by: '',
  registration_region: '',
  registration_city: '',
  registration_street: '',
  registration_house: '',
  registration_building: '',
  registration_apartment: '',
})

onMounted(async () => {
  await loadData()
})

const loadData = async (): Promise<void> => {
  employees.value = await employeeApi.getEmployees()
}

const openCreateModal = (): void => {
  resetNewForm()
  showCreateModal.value = true
}

const createEmployee = async (): Promise<void> => {
  showLastNameError.value = true
  showFirstNameError.value = true
  showMiddleNameError.value = true
  showBirthDateError.value = true

  if (!newEmployee.value.last_name.trim() ||
      !newEmployee.value.first_name.trim() ||
      !newEmployee.value.middle_name.trim() ||
      !newEmployee.value.birth_date) {
    return
  }

  const createdEmployee = await employeeApi.createEmployee(newEmployee.value)
  await loadData()
  closeCreateModal()

  router.push(`/employees/${createdEmployee.id}`)
}

const openDetailView = (id: number): void => {
  router.push(`/employees/${id}`)
}

const closeCreateModal = (): void => {
  showCreateModal.value = false
  resetNewForm()
}

const resetNewForm = (): void => {
  newEmployee.value = {
    last_name: '',
    first_name: '',
    middle_name: '',
    birth_date: '',
    passport_series: '',
    passport_number: '',
    passport_issue_date: '',
    passport_issue_code: '',
    passport_issued_by: '',
    registration_region: '',
    registration_city: '',
    registration_street: '',
    registration_house: '',
    registration_building: '',
    registration_apartment: '',
  }
  showLastNameError.value = false
  showFirstNameError.value = false
  showBirthDateError.value = false
  showMiddleNameError.value = false
}
</script>

<style scoped>
.employees-container {
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

.header h1 {
  color: #2c3e50;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f8f9fa;
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

.form-group input {
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

:deep(.clickable-row:hover) {
  background-color: #f8f9fa;
}

:deep(.data-table td) {
  overflow-wrap: break-word;
  white-space: normal;
  vertical-align: middle;
}
</style>
