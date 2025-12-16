<template>
  <div class="organizations-container">
    <div class="header">
      <h1>Организации</h1>
      <AppButton variant="primary" @click="openCreateModal"> Добавить организацию </AppButton>
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
          <td>{{ formatDate(organization.created_at) }}</td>
          <td class="actions">
            <AppButton variant="secondary" @click="openEditModal(organization)">
              Редактировать
            </AppButton>
            <AppButton
              variant="danger"
              @click="openDeleteModal(organization.id!, organization.name)"
            >
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет организаций для отображения</div>

    <FormModal
      :show="showCreateModal"
      title="Создание организации"
      submit-text="Создать"
      @submit="createOrganization"
      @cancel="closeCreateModal"
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
      :show="showEditModal"
      title="Редактирование организации"
      submit-text="Сохранить"
      @submit="updateOrganization"
      @cancel="closeEditModal"
    >
      <div class="form-group">
        <label>Название организации:</label>
        <input
          type="text"
          v-model="editingOrganization.name"
          :class="{ error: showEditNameError && !editingOrganization.name?.trim() }"
          placeholder="Введите название организации"
        />
        <span v-if="showEditNameError && !editingOrganization.name?.trim()" class="error-text">
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
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@/types/organization'

import { formatDate } from '@/utils/helpers'

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

const organizations = ref<Organization[]>([])

const newOrganization = ref<CreateOrganizationDto>({
  name: '',
  comment: '',
})

const editingOrganizationId = ref<number | null>(null)
const originalOrganizationData = ref<UpdateOrganizationDto>({
  name: '',
  comment: '',
})
const editingOrganization = ref<UpdateOrganizationDto>({
  name: '',
  comment: '',
})

const organizationToDelete = ref<number | null>(null)
const deleteMessage = ref('')

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  organizations.value = await organizationApi.getOrganizations()
}

const openCreateModal = (): void => {
  resetNewForm()
  showCreateModal.value = true
  showEditModal.value = false
}

const createOrganization = async () => {
  showNameError.value = true

  if (!newOrganization.value.name.trim()) {
    return
  }

  await organizationApi.createOrganization(newOrganization.value)
  await loadData()
  closeCreateModal()
}

const openEditModal = async (organization: Organization) => {
  editingOrganizationId.value = organization.id

  const ogrData = await organizationApi.getOrganizationById(organization.id)

  editingOrganization.value = {
    name: ogrData.name,
    comment: ogrData.comment,
  }

  originalOrganizationData.value = {
    name: ogrData.name,
    comment: ogrData.comment,
  }

  showEditModal.value = true
  showCreateModal.value = false
}

const updateOrganization = async () => {
  showEditNameError.value = true

  if (!editingOrganization.value.name?.trim()) {
    return
  }

  const changes: UpdateOrganizationDto = {}

  if (editingOrganization.value.name?.trim() !== originalOrganizationData.value.name) {
    changes.name = editingOrganization.value.name
  }

  if (editingOrganization.value.comment?.trim() !== originalOrganizationData.value.comment) {
    changes.comment = editingOrganization.value.comment
  }

  if (Object.keys(changes).length === 0) {
    closeEditModal()
    return
  }

  await organizationApi.updateOrganization(editingOrganizationId.value!, changes)
  await loadData()
  closeEditModal()
}

const openDeleteModal = (id: number, name: string) => {
  organizationToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить организацию <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await organizationApi.deleteOrganization(organizationToDelete.value!)
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
  organizationToDelete.value = 0
  deleteMessage.value = ''
}

const resetNewForm = () => {
  newOrganization.value = {
    name: '',
    comment: '',
  }
  showNameError.value = false
}

const resetEditForm = () => {
  editingOrganizationId.value = null
  editingOrganization.value = {
    name: '',
    comment: '',
  }
  showEditNameError.value = false
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
