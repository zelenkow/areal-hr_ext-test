<template>
  <div class="organizations-container">
    <div class="header">
      <h1>Организации</h1>
      <AppButton variant="primary" @click="startCreate"> Добавить организацию </AppButton>
    </div>

    <DataTable v-if="organizations.length" striped hover>
      <template #headers>
        <th style="width: 25%">Название</th>
        <th style="width: 40%">Комментарий</th>
        <th style="width: 15%">Дата</th>
        <th style="width: 20%">Действия</th>
      </template>

      <template #rows>
        <tr v-for="organization in organizations" :key="organization.id">
          <td>{{ organization.name }}</td>
          <td>{{ organization.comment || '-' }}</td>
          <td>{{ dateCreate(organization.created_at!) }}</td>
          <td class="actions">
            <AppButton variant="secondary" @click="startEdit(organization)">
              Редактировать
            </AppButton>
            <AppButton
              variant="danger"
              @click="deleteOrganization(organization.id!, organization.name)"
            >
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет организаций для отображения</div>

    <FormModal
      :show="showCreateForm"
      title="Создание организации"
      submit-text="Создать"
      @submit="createOrganization"
      @cancel="cancelCreate"
    >
      <div class="form-group">
        <label>Название организации:</label>
        <input
          type="text"
          v-model="newOrganization.name"
          :class="{ error: showNameError && !newOrganization.name.trim() }"
          placeholder="Введите название организации"
        />
        <span v-if="showNameError && !newOrganization.name.trim()" class="error-text">
          Название обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Комментарий:</label>
        <textarea
          v-model="newOrganization.comment"
          rows="3"
          placeholder="Введите комментарий"
        ></textarea>
      </div>
    </FormModal>

    <FormModal
      :show="showEditForm"
      title="Редактирование организации"
      submit-text="Сохранить"
      @submit="updateOrganization"
      @cancel="cancelEdit"
    >
      <div class="form-group">
        <label>Название организации:</label>
        <input
          type="text"
          v-model="editingOrganization.name"
          :class="{ error: showEditNameError && !editingOrganization.name.trim() }"
          placeholder="Введите название организации"
        />
        <span v-if="showEditNameError && !editingOrganization.name.trim()" class="error-text">
          Название обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Комментарий:</label>
        <textarea
          v-model="editingOrganization.comment"
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
import { ref, onMounted } from 'vue'
import type { Organization } from '@/services'
import { organizationApi } from '@/services'

const showNameError = ref(false)
const showEditNameError = ref(false)
const showCreateForm = ref(false)
const showDeleteModal = ref(false)
const showEditForm = ref(false)
const organizationToDelete = ref(0)
const deleteMessage = ref('')
const organizations = ref<Organization[]>([])
const newOrganization = ref<Organization>({
  name: '',
  comment: '',
})
const editingOrganization = ref<Organization>({
  id: 0,
  name: '',
  comment: '',
})

onMounted(async () => {
  await loadOrganizations()
})

const loadOrganizations = async () => {
  organizations.value = await organizationApi.getOrganizations()
}

const startCreate = () => {
  showCreateForm.value = true
  showEditForm.value = false
  resetForm()
}

const startEdit = (organization: Organization) => {
  editingOrganization.value = { ...organization }
  showEditForm.value = true
  showCreateForm.value = false
}

const createOrganization = async () => {
  showNameError.value = true

  if (!newOrganization.value.name.trim()) {
    return
  }
  await organizationApi.createOrganization(newOrganization.value)
  await loadOrganizations()
  showCreateForm.value = false
  resetForm()
}

const updateOrganization = async () => {
  showEditNameError.value = true

  if (!editingOrganization.value.name.trim()) {
    return
  }
  await organizationApi.updateOrganization(editingOrganization.value.id!, editingOrganization.value)
  await loadOrganizations()
  showEditForm.value = false
  resetEditForm()
}

const deleteOrganization = (id: number, name: string) => {
  organizationToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить организацию <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  await organizationApi.deleteOrganization(organizationToDelete.value)
  await loadOrganizations()
  showDeleteModal.value = false
  organizationToDelete.value = 0
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  organizationToDelete.value = 0
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
  newOrganization.value = {
    name: '',
    comment: '',
  }
}

const resetEditForm = () => {
  editingOrganization.value = {
    id: 0,
    name: '',
    comment: '',
  }
}

const dateCreate = (date: Date) => {
  return new Date(date).toLocaleDateString('ru-RU')
}
</script>

<style scoped>
.organizations-container {
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
.form-group textarea::placeholder {
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
</style>
