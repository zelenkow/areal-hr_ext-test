<template>
  <div class="departments-container">
    <div class="header">
      <h1>Отделы</h1>
      <AppButton variant="primary" @click="openCreateModal"> Добавить отдел </AppButton>
    </div>

    <DataTable v-if="departments.length" striped hover>
      <template #headers>
        <th style="width: 20%">Организация</th>
        <th style="width: 15%">Название</th>
        <th style="width: 20%">Родительский отдел</th>
        <th style="width: 25%">Комментарий</th>
        <th style="width: 20%">Действия</th>
      </template>

      <template #rows>
        <tr v-for="department in departments" :key="department.id">
          <td>{{ getOrganizationName(department.organization_id) }}</td>
          <td>{{ department.name }}</td>
          <td>{{ getParentDepartmentName(department.parent_id) }}</td>
          <td>{{ department.comment || '-' }}</td>
          <td class="actions">
            <AppButton variant="secondary" @click="openEditModal(department)">
              Редактировать
            </AppButton>
            <AppButton variant="danger" @click="openDeleteModal(department.id!, department.name)">
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет отделов для отображения</div>

    <FormModal
      :show="showCreateModal"
      title="Создание отдела"
      submit-text="Создать"
      @submit="createDepartment"
      @cancel="closeCreateModal"
    >
      <div class="form-group">
        <label>Организация:</label>
        <select
          v-model="newDepartment.organization_id"
          :class="{ error: showOrganizationError && !newDepartment.organization_id }"
        >
          <option value="">Выберите организацию</option>
          <option v-for="org in organizations" :key="org.id" :value="org.id">
            {{ org.name }}
          </option>
        </select>
        <span v-if="showOrganizationError && !newDepartment.organization_id" class="error-text">
          Организация обязательна
        </span>
      </div>
      <div class="form-group">
        <label>Название отдела:</label>
        <input
          type="text"
          v-model="newDepartment.name"
          :class="{ error: showNameError && !newDepartment.name.trim() }"
          placeholder="Введите название отдела"
        />
        <span v-if="showNameError && !newDepartment.name.trim()" class="error-text">
          Название обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Родительский отдел:</label>
        <select v-model="newDepartment.parent_id">
          <option :value="undefined">Нет</option>
          <option v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Комментарий:</label>
        <textarea
          v-model="newDepartment.comment"
          rows="3"
          placeholder="Введите комментарий"
        ></textarea>
      </div>
    </FormModal>

    <FormModal
      :show="showEditModal"
      title="Редактирование отдела"
      submit-text="Сохранить"
      @submit="updateDepartment"
      @cancel="closeEditModal"
    >
      <div class="form-group">
        <label>Название отдела:</label>
        <input
          type="text"
          v-model="editingDepartment.name"
          :class="{ error: showEditNameError && !editingDepartment.name?.trim() }"
          placeholder="Введите название отдела"
        />
        <span v-if="showEditNameError && !editingDepartment.name?.trim()" class="error-text">
          Название обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Комментарий:</label>
        <textarea
          v-model="editingDepartment.comment"
          rows="3"
          placeholder="Введите комментарий"
        ></textarea>
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
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/types/department'
import type { Organization } from '@/types/organization'

import { departmentApi } from '@/services/department-api'
import { organizationApi } from '@/services/organization-api'

import FormModal from '@/components/FormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AppButton from '@/components/AppButton.vue'
import DataTable from '@/components/DataTable.vue'

import { ref, onMounted } from 'vue'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const showNameError = ref(false)
const showEditNameError = ref(false)
const showOrganizationError = ref(false)

const departments = ref<Department[]>([])
const organizations = ref<Organization[]>([])

const newDepartment = ref<CreateDepartmentDto>({
  organization_id: 0,
  name: '',
  parent_id: undefined,
  comment: '',
})

const editingDepartmentId = ref<number | null>(null)
const originalDepartmentData = ref<UpdateDepartmentDto>({
  name: '',
  comment: '',
})
const editingDepartment = ref<UpdateDepartmentDto>({
  name: '',
  comment: '',
})

const departmentToDelete = ref(0)
const deleteMessage = ref('')

onMounted(async () => {
  await loadData()
})

const getOrganizationName = (orgId: number): string => {
  const org = organizations.value.find((o) => o.id === orgId)
  return org?.name || '-'
}

const getParentDepartmentName = (parentId?: number | null): string => {
  if (!parentId) return '-'
  const parent = departments.value.find((d) => d.id === parentId)
  return parent?.name || '-'
}

const loadData = async () => {
  departments.value = await departmentApi.getDepartments()
  organizations.value = await organizationApi.getOrganizations()
}

const openCreateModal = () => {
  resetNewForm()
  showCreateModal.value = true
  showEditModal.value = false
}

const createDepartment = async () => {
  showNameError.value = true
  showOrganizationError.value = true

  if (!newDepartment.value.organization_id || !newDepartment.value.name.trim()) {
    return
  }

  await departmentApi.createDepartment(newDepartment.value)
  await loadData()
  closeCreateModal()
}

const openEditModal = async (department: Department) => {
  const ogrData = await departmentApi.getDepartmentById(department.id)

  editingDepartmentId.value = department.id
  editingDepartment.value = {
    name: ogrData.name,
    comment: ogrData.comment,
  }

  originalDepartmentData.value = {
    name: ogrData.name,
    comment: ogrData.comment,
  }

  showEditModal.value = true
  showCreateModal.value = false
}

const updateDepartment = async () => {
  showEditNameError.value = true

  if (!editingDepartment.value.name?.trim()) {
    return
  }

  const changes: UpdateDepartmentDto = {}

  if (editingDepartment.value.name?.trim() !== originalDepartmentData.value.name) {
    changes.name = editingDepartment.value.name
  }

  if (editingDepartment.value.comment?.trim() !== originalDepartmentData.value.comment) {
    changes.comment = editingDepartment.value.comment
  }

  if (Object.keys(changes).length === 0) {
    closeEditModal()
    return
  }

  await departmentApi.updateDepartment(editingDepartmentId.value!, changes)
  await loadData()
  closeEditModal()
}

const openDeleteModal = (id: number, name: string) => {
  departmentToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить отдел <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await departmentApi.deleteDepartment(departmentToDelete.value)
  await loadData()
  closeDeleteModal()
}

const closeCreateModal = () => {
  showCreateModal.value = false
  resetNewForm()
}

const closeEditModal = () => {
  showEditModal.value = false
  resetEditForm()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  departmentToDelete.value = 0
  deleteMessage.value = ''
}

const resetNewForm = () => {
  newDepartment.value = {
    organization_id: 0,
    name: '',
    parent_id: undefined,
    comment: '',
  }
  showNameError.value = false
  showOrganizationError.value = false
}

const resetEditForm = () => {
  editingDepartmentId.value = null
  editingDepartment.value = {
    name: '',
    comment: '',
  }
  showEditNameError.value = false
}
</script>

<style scoped>
.departments-container {
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

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.form-group select::placeholder {
  color: #a0a0a0;
  font-style: italic;
  opacity: 0.8;
}

:deep(.data-table td:nth-child(1)) {
  overflow-wrap: break-word;
  white-space: normal;
}

:deep(.data-table td:nth-child(2)) {
  overflow-wrap: break-word;
  white-space: normal;
}

:deep(.data-table td:nth-child(3)) {
  overflow-wrap: break-word;
  white-space: normal;
}

:deep(.data-table td:nth-child(4)) {
  overflow-wrap: break-word;
  white-space: normal;
  word-break: break-word;
}

</style>
