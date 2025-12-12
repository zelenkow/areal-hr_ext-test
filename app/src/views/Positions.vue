<template>
  <div class="positions-container">
    <div class="header">
      <h1>Должности</h1>
      <AppButton variant="primary" @click="openCreateModal"> Добавить должность </AppButton>
    </div>

    <DataTable v-if="positions.length" striped hover>
      <template #headers>
        <th style="width: 60%">Название</th>
        <th style="width: 20%">Дата</th>
        <th style="width: 20%">Действия</th>
      </template>

      <template #rows>
        <tr v-for="position in positions" :key="position.id">
          <td>{{ position.name }}</td>
          <td>{{ formatDate(position.created_at!) }}</td>
          <td class="actions">
            <AppButton variant="secondary" @click="openEditModal(position)">
              Редактировать
            </AppButton>
            <AppButton variant="danger" @click="openDeleteModal(position.id!, position.name)">
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет должностей для отображения</div>

    <FormModal
      :show="showCreateModal"
      title="Создание должности"
      submit-text="Создать"
      @submit="createPosition"
      @cancel="closeCreateModal"
    >
      <div class="form-group">
        <label>Название должности:</label>
        <input
          type="text"
          v-model="newPosition.name"
          :class="{ error: showNameError && !newPosition.name.trim() }"
          placeholder="Введите название должности"
        />
        <span v-if="showNameError && !newPosition.name.trim()" class="error-text">
          Название обязательно
        </span>
      </div>
    </FormModal>

    <FormModal
      :show="showEditModal"
      title="Редактирование должности"
      submit-text="Сохранить"
      @submit="updatePosition"
      @cancel="closeEditModal"
    >
      <div class="form-group">
        <label>Название должности:</label>
        <input
          type="text"
          v-model="editingPosition.name"
          :class="{ error: showEditNameError && !editingPosition.name?.trim() }"
          placeholder="Введите название должности"
        />
        <span v-if="showEditNameError && !editingPosition.name?.trim()" class="error-text">
          Название обязательно
        </span>
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
import type { Position, CreatePositionDto, UpdatePositionDto } from '@/types/position'

import { positionApi } from '@/services/position-api'

import { formatDate } from '@/utils/helpers'

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

const positions = ref<Position[]>([])

const newPosition = ref<CreatePositionDto>({
  name: '',
})

const editingPositionId = ref<number | null>(null)
const originalPositionData = ref<UpdatePositionDto>({
  name: '',
})
const editingPosition = ref<UpdatePositionDto>({
  name: '',
})

const positionToDelete = ref(0)
const deleteMessage = ref('')

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  positions.value = await positionApi.getPositions()
}

const openCreateModal = () => {
  resetNewForm()
  showCreateModal.value = true
  showEditModal.value = false
}

const createPosition = async () => {
  showNameError.value = true

  if (!newPosition.value.name.trim()) {
    return
  }

  await positionApi.createPosition(newPosition.value)
  await loadData()
  closeCreateModal()
}

const openEditModal = async (position: Position) => {
  const ogrData = await positionApi.getPositionById(position.id)

  editingPositionId.value = position.id
  editingPosition.value = {
    name: ogrData.name,
  }

  originalPositionData.value = {
    name: ogrData.name,
  }

  showEditModal.value = true
  showCreateModal.value = false
}

const updatePosition = async () => {
  showEditNameError.value = true

  if (!editingPosition.value.name?.trim()) {
    return
  }

  const changes: UpdatePositionDto = {}

  if (editingPosition.value.name?.trim() !== originalPositionData.value.name) {
    changes.name = editingPosition.value.name
  }

  if (Object.keys(changes).length === 0) {
    closeEditModal()
    return
  }

  await positionApi.updatePosition(editingPositionId.value!, changes)
  await loadData()
  closeEditModal()
}

const openDeleteModal = (id: number, name: string) => {
  positionToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить должность <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await positionApi.deletePosition(positionToDelete.value)
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
  positionToDelete.value = 0
  deleteMessage.value = ''
}

const resetNewForm = () => {
  newPosition.value = {
    name: '',
  }
  showNameError.value = false
}

const resetEditForm = () => {
  editingPositionId.value = null
  editingPosition.value = {
    name: '',
  }
  showEditNameError.value = false
}
</script>

<style scoped>
.positions-container {
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

.form-group input::placeholder {
  color: #a0a0a0;
  font-style: italic;
  opacity: 0.8;
}

:deep(.data-table td:nth-child(1)) {
  overflow-wrap: break-word;
  white-space: normal;
}
</style>
