<template>
  <div class="employee-detail">
    <div class="header">
      <AppButton variant="primary" @click="goBack">← Назад к списку</AppButton>
      <div class="header-actions">
        <AppButton variant="secondary" @click="openEditModal">Редактировать</AppButton>
        <AppButton variant="danger" @click="openDeleteModal">Удалить</AppButton>
      </div>
    </div>

    <h1>{{ formatFullName(employee) }}</h1>

    <div class="tabs">
      <button
        :class="['tab', { active: activePageTab === 'personal' }]"
        @click="activePageTab = 'personal'"
      >
        Личные данные
      </button>
      <button
        :class="['tab', { active: activePageTab === 'documents' }]"
        @click="activePageTab = 'documents'"
      >
        Документы
      </button>
      <button
        :class="['tab', { active: activePageTab === 'operations' }]"
        @click="activePageTab = 'operations'"
      >
        Кадровые операции
      </button>
    </div>

    <div class="content">
      <EmployeePersonalTab v-if="activePageTab === 'personal'" :employee="employee" />
      <EmployeeDocumentsTab v-if="activePageTab === 'documents'" :employee-id="employeeId" />
      <EmployeeOperationsTab v-if="activePageTab === 'operations'" :employee-id="employeeId" />
    </div>

    <FormModal
      :show="showEditModal"
      title="Редактирование сотрудника"
      submit-text="Сохранить"
      @submit="updateEmployee"
      @cancel="closeEditModal"
    >
      <div class="modal-tabs">
        <AppButton
          :variant="activeTab === 'basic' ? 'primary' : 'secondary'"
          @click="activeTab = 'basic'"
        >
          Основные
        </AppButton>
        <AppButton
          :variant="activeTab === 'passport' ? 'primary' : 'secondary'"
          @click="activeTab = 'passport'"
        >
          Паспорт
        </AppButton>
        <AppButton
          :variant="activeTab === 'address' ? 'primary' : 'secondary'"
          @click="activeTab = 'address'"
        >
          Адрес
        </AppButton>
      </div>

      <div class="modal-content">
        <div v-if="activeTab === 'basic'" class="tab-pane">
          <div class="form-group">
            <label>Фамилия:</label>
            <input v-model="formData.last_name" placeholder="Введите фамилию" />
          </div>
          <div class="form-group">
            <label>Имя:</label>
            <input v-model="formData.first_name" placeholder="Введите имя" />
          </div>
          <div class="form-group">
            <label>Отчество:</label>
            <input v-model="formData.middle_name" placeholder="Введите отчество" />
          </div>
          <div class="form-group">
            <label>Дата рождения:</label>
            <input type="text" v-model="formData.birth_date" />
          </div>
        </div>

        <div v-if="activeTab === 'passport'" class="tab-pane">
          <div class="form-group">
            <label>Серия паспорта:</label>
            <input v-model="formData.passport_series" placeholder="0000" maxlength="4" />
          </div>
          <div class="form-group">
            <label>Номер паспорта:</label>
            <input v-model="formData.passport_number" placeholder="000000" maxlength="6" />
          </div>
          <div class="form-group">
            <label>Дата выдачи:</label>
            <input type="text" v-model="formData.passport_issue_date" placeholder="дд.мм.гггг" />
          </div>
          <div class="form-group">
            <label>Код подразделения:</label>
            <input v-model="formData.passport_issue_code" placeholder="000-000" maxlength="7" />
          </div>
          <div class="form-group">
            <label>Кем выдан:</label>
            <textarea
              v-model="formData.passport_issued_by"
              rows="3"
              placeholder="Кем выдан паспорт"
            ></textarea>
          </div>
        </div>

        <div v-if="activeTab === 'address'" class="tab-pane">
          <div class="form-group">
            <label>Область:</label>
            <input v-model="formData.registration_region" placeholder="Введите область" />
          </div>
          <div class="form-group">
            <label>Населенный пункт:</label>
            <input v-model="formData.registration_city" placeholder="Населенный пункт" />
          </div>
          <div class="form-group">
            <label>Улица:</label>
            <input v-model="formData.registration_street" placeholder="Введите улицу" />
          </div>

          <div class="form-row compact-fields">
            <div class="form-row">
              <div class="form-group">
                <label>Дом:</label>
                <input v-model="formData.registration_house" placeholder="Дом" />
              </div>
              <div class="form-group">
                <label>Корпус:</label>
                <input v-model="formData.registration_building" placeholder="Корпус" />
              </div>
              <div class="form-group">
                <label>Квартира:</label>
                <input v-model="formData.registration_apartment" placeholder="Квартира" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>

    <ConfirmModal
      :show="showDeleteModal"
      :message="deleteMessage"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import type { Employee, UpdateEmployeeDto } from '@/types/employee'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employeeApi } from '@/services/employee-api'

import FormModal from '@/components/FormModal.vue'
import AppButton from '@/components/AppButton.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import EmployeePersonalTab from '@/views/employee-tabs/EmployeePersonalTab.vue'
import EmployeeDocumentsTab from '@/views/employee-tabs/EmployeeDocumentsTab.vue'

const route = useRoute()
const router = useRouter()
const employeeId = Number(route.params.id)

const employee = ref<Employee>({} as Employee)
const activePageTab = ref<'personal' | 'documents' | 'operations'>('personal')

const showEditModal = ref(false)
const activeTab = ref<'basic' | 'passport' | 'address'>('basic')
const formData = ref<UpdateEmployeeDto>({})
const originalEmployeeData = ref<UpdateEmployeeDto>({})

const showDeleteModal = ref(false)
const deleteMessage = ref('')

onMounted(async () => {
  await loadEmployee()
})

const loadEmployee = async () => {
  employee.value = await employeeApi.getEmployeeById(employeeId)
}

const goBack = () => {
  router.push('/employees')
}

const openEditModal = () => {
  formData.value = { ...employee.value }
  originalEmployeeData.value = { ...employee.value }
  activeTab.value = 'basic'
  showEditModal.value = true
}

const updateEmployee = async () => {
  const changes: UpdateEmployeeDto = {}

  const fieldsToCompare = [
    'last_name',
    'first_name',
    'middle_name',
    'birth_date',
    'passport_series',
    'passport_number',
    'passport_issue_date',
    'passport_issue_code',
    'passport_issued_by',
    'registration_region',
    'registration_city',
    'registration_street',
    'registration_house',
    'registration_building',
    'registration_apartment',
  ] as const

  fieldsToCompare.forEach((field) => {
    if (formData.value[field] !== originalEmployeeData.value[field]) {
      changes[field] = formData.value[field]
    }
  })

  if (Object.keys(changes).length === 0) {
    closeEditModal()
    return
  }

  await employeeApi.updateEmployee(employeeId, changes)
  await loadEmployee()
  closeEditModal()
}

const closeEditModal = () => {
  showEditModal.value = false
  formData.value = {}
  originalEmployeeData.value = {}
}

const openDeleteModal = () => {
  deleteMessage.value = `Вы уверены, что хотите удалить сотрудника <strong>"${formatFullName(employee.value)}"</strong>?`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await employeeApi.deleteEmployee(employeeId)
  await loadEmployee()
  closeDeleteModal()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteMessage.value = ''
}

const formatFullName = (employee: Employee): string => {
  const parts = [employee.last_name, employee.first_name, employee.middle_name]
  return parts.join(' ')
}
</script>

<style scoped>
.employee-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.tab {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  transition: all 0.2s;
}

.tab:hover {
  background: #e9ecef;
}

.tab.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.content {
  min-height: 400px;
}

.modal-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-content {
  max-height: 400px;
  padding-right: 10px;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #495057;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.compact-fields .form-group {
  max-width: 150px;
}
</style>
