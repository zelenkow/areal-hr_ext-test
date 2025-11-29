<template>
  <div class="positions-container">
    <div class="header">
      <h1>Должности</h1>
      <AppButton variant="primary" @click="startCreate"> Добавить должность </AppButton>
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
          <td>{{ dateCreate(position.created_at!) }}</td>
          <td class="actions">
            <AppButton variant="secondary" @click="startEdit(position)"> Редактировать </AppButton>
            <AppButton variant="danger" @click="deletePosition(position.id!, position.name)">
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет должностей для отображения</div>

    <FormModal
      :show="showCreateForm"
      title="Создание должности"
      submit-text="Создать"
      @submit="createPosition"
      @cancel="cancelCreate"
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
      :show="showEditForm"
      title="Редактирование должности"
      submit-text="Сохранить"
      @submit="updatePosition"
      @cancel="cancelEdit"
    >
      <div class="form-group">
        <label>Название должности:</label>
        <input
          type="text"
          v-model="editingPosition.name"
          :class="{ error: showEditNameError && !editingPosition.name.trim() }"
          placeholder="Введите название должности"
        />
        <span v-if="showEditNameError && !editingPosition.name.trim()" class="error-text">
          Название обязательно
        </span>
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
import type { Position } from '@/services'
import { positionApi } from '@/services'

const showNameError = ref(false)
const showEditNameError = ref(false)
const showCreateForm = ref(false)
const showDeleteModal = ref(false)
const showEditForm = ref(false)
const positionToDelete = ref(0)
const deleteMessage = ref('')
const positions = ref<Position[]>([])
const newPosition = ref<Position>({
  name: '',
})
const editingPosition = ref<Position>({
  id: 0,
  name: '',
})

onMounted(async () => {
  await loadPositions()
})

const loadPositions = async () => {
  positions.value = await positionApi.getPositions()
}

const startCreate = () => {
  showCreateForm.value = true
  showEditForm.value = false
  resetForm()
}

const startEdit = (position: Position) => {
  editingPosition.value = { ...position }
  showEditForm.value = true
  showCreateForm.value = false
}

const createPosition = async () => {
  showNameError.value = true

  if (!newPosition.value.name.trim()) {
    return
  }
  await positionApi.createPosition(newPosition.value)
  await loadPositions()
  showCreateForm.value = false
  resetForm()
}

const updatePosition = async () => {
  showEditNameError.value = true

  if (!editingPosition.value.name.trim()) {
    return
  }
  await positionApi.updatePosition(editingPosition.value.id!, editingPosition.value)
  await loadPositions()
  showEditForm.value = false
  resetEditForm()
}

const deletePosition = (id: number, name: string) => {
  positionToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить должность <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  await positionApi.deletePosition(positionToDelete.value)
  await loadPositions()
  showDeleteModal.value = false
  positionToDelete.value = 0
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  positionToDelete.value = 0
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
  newPosition.value = {
    name: '',
  }
  showNameError.value = false
}

const resetEditForm = () => {
  editingPosition.value = {
    id: 0,
    name: '',
  }
  showEditNameError.value = false
}

const dateCreate = (date: Date) => {
  return new Date(date).toLocaleDateString('ru-RU')
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
