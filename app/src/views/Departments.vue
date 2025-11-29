<template>
  <div class="departments-container">
    <div class="header">
      <h1>Отделы</h1>
      <AppButton variant="primary" @click="startCreate"> Добавить отдел </AppButton>
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
            <AppButton variant="secondary" @click="startEdit(department)">
              Редактировать
            </AppButton>
            <AppButton variant="danger" @click="deleteDepartment(department.id!, department.name)">
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет отделов для отображения</div>

    <FormModal
      :show="showCreateForm"
      title="Создание отдела"
      submit-text="Создать"
      @submit="createDepartment"
      @cancel="cancelCreate"
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
          <option v-for="dept in parentDepartments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
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
      :show="showEditForm"
      title="Редактирование отдела"
      submit-text="Сохранить"
      @submit="updateDepartment"
      @cancel="cancelEdit"
    >
      <div class="form-group">
        <label>Название отдела:</label>
        <input
          type="text"
          v-model="editingDepartment.name"
          :class="{ error: showEditNameError && !editingDepartment.name.trim() }"
          placeholder="Введите название отдела"
        />
        <span v-if="showEditNameError && !editingDepartment.name.trim()" class="error-text">
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
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import FormModal from '@/components/FormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AppButton from '@/components/AppButton.vue'
import DataTable from '@/components/DataTable.vue'
import { ref, onMounted, computed } from 'vue'
import type { Department, Organization } from '@/services'
import { departmentApi, organizationApi } from '@/services'

const showNameError = ref(false)
const showEditNameError = ref(false)
const showOrganizationError = ref(false)
const showCreateForm = ref(false)
const showEditForm = ref(false)
const showDeleteModal = ref(false)
const departments = ref<Department[]>([])
const organizations = ref<Organization[]>([])
const departmentToDelete = ref(0)
const deleteMessage = ref('')

const newDepartment = ref<Department>({
  organization_id: 0,
  name: '',
  parent_id: undefined,
  comment: '',
})

const editingDepartment = ref<Department>({
  id: 0,
  organization_id: 0,
  name: '',
  parent_id: undefined,
  comment: '',
})

const parentDepartments = computed(() => {
  return departments.value.filter((dept) => dept.id !== editingDepartment.value.id)
})

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  departments.value = await departmentApi.getDepartments()
  organizations.value = await organizationApi.getOrganizations()
}

const getOrganizationName = (orgId: number) => {
  const org = organizations.value.find((o) => o.id === orgId)
  return org?.name || '-'
}

const getParentDepartmentName = (parentId?: number) => {
  if (!parentId) return '-'
  const parent = departments.value.find((d) => d.id === parentId)
  return parent?.name || '-'
}

const startCreate = () => {
  showCreateForm.value = true
  showEditForm.value = false
  resetForm()
}

const startEdit = (department: Department) => {
  editingDepartment.value = { ...department }
  showEditForm.value = true
  showCreateForm.value = false
}

const createDepartment = async () => {
  showNameError.value = true
  showOrganizationError.value = true

  if (!newDepartment.value.organization_id || !newDepartment.value.name.trim()) {
    return
  }
  await departmentApi.createDepartment(newDepartment.value)
  await loadData()
  showCreateForm.value = false
  resetForm()
}

const updateDepartment = async () => {
  showEditNameError.value = true

  if (!editingDepartment.value.name.trim()) {
    return
  }
  await departmentApi.updateDepartment(editingDepartment.value.id!, editingDepartment.value)
  await loadData()
  showEditForm.value = false
  resetEditForm()
}

const deleteDepartment = (id: number, name: string) => {
  departmentToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить отдел <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  await departmentApi.deleteDepartment(departmentToDelete.value)
  await loadData()
  showDeleteModal.value = false
  departmentToDelete.value = 0
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  departmentToDelete.value = 0
}

const cancelCreate = () => {
  showCreateForm.value = false
  resetForm()
}

const cancelEdit = () => {
  showEditForm.value = false
  resetEditForm()
}

const resetForm = () => {
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
  editingDepartment.value = {
    id: 0,
    organization_id: 0,
    name: '',
    parent_id: undefined,
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
