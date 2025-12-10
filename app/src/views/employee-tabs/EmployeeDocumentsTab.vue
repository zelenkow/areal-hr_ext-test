<template>
  <div class="documents-tab">
    <div class="documents-header">
      <h2>Документы сотрудника</h2>
      <AppButton variant="primary" @click="openUploadModal"> Загрузить документ </AppButton>
    </div>

    <DataTable v-if="files.length" striped hover>
      <template #headers>
        <th style="width: 40%">Название</th>
        <th style="width: 30%">Дата загрузки</th>
        <th style="width: 30%">Действия</th>
      </template>

      <template #rows>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.name }}</td>
          <td>{{ formatDate(file.created_at) }}</td>
          <td class="actions">
            <AppButton variant="secondary" size="small" @click="handleDownload(file)">
              Скачать
            </AppButton>
            <AppButton variant="danger" size="small" @click="openDeleteModal(file.id)">
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="empty-section">
      <p>Нет загруженных документов</p>
    </div>

    <FormModal
      :show="showUploadModal"
      title="Загрузить документ"
      submit-text="Загрузить"
      @submit="handleUpload"
      @cancel="closeUploadModal"
    >
      <div class="form-group">
        <label>Название документа:</label>
        <input
          v-model="uploadForm.name"
          :class="{ error: showFileNameError && !uploadForm.name.trim() }"
          placeholder="Введите название"
        />
        <span v-if="showFileNameError && !uploadForm.name.trim()" class="error-text">
          Название обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Выберите файл:</label>
        <input
          type="file"
          :class="{ error: showFileError && !uploadForm.file }"
          @change="handleFileSelect"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <span v-if="showFileError && !uploadForm.file" class="error-text"> Файл обязателен </span>
        <small class="file-hint">
          Поддерживаемые форматы: PDF, JPG, PNG, DOC, DOCX. Максимальный размер: 10MB
        </small>
      </div>
      <div v-if="uploadForm.file" class="selected-file">
        Выбран файл: {{ uploadForm.file.name }} ({{ formatFileSize(uploadForm.file.size) }})
      </div>
    </FormModal>

    <ConfirmModal
      :show="showDeleteModal"
      :message="deleteMessage"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import type { FileEntity } from '@/types/file'
import { ref, onMounted } from 'vue'
import { fileApi } from '@/services/file-api'
import { filesize } from 'filesize'

import AppButton from '@/components/AppButton.vue'
import FormModal from '@/components/FormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import DataTable from '@/components/DataTable.vue'

interface Props {
  employeeId: number
}

const props = defineProps<Props>()

const files = ref<FileEntity[]>([])

const showUploadModal = ref(false)
const uploadForm = ref({
  name: '',
  file: null as File | null,
})
const showFileNameError = ref(false)
const showFileError = ref(false)

const showDeleteModal = ref(false)
const fileToDeleteId = ref<number | null>(null)
const deleteMessage = ref('')

onMounted(() => {
  loadFiles()
})

const loadFiles = async () => {
  files.value = await fileApi.getEmployeeFiles(props.employeeId)
}

const openUploadModal = () => {
  uploadForm.value = { name: '', file: null }
  showFileNameError.value = false
  showFileError.value = false
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    uploadForm.value.file = input.files[0]
    showFileError.value = false
  }
}

const handleUpload = async () => {
  showFileNameError.value = false
  showFileError.value = false

  let hasError = false

  if (!uploadForm.value.name.trim()) {
    showFileNameError.value = true
    hasError = true
  }

  if (!uploadForm.value.file) {
    showFileError.value = true
    hasError = true
  }

  if (hasError) {
    return
  }

  await fileApi.uploadFile(
    {
      employee_id: props.employeeId,
      name: uploadForm.value.name.trim(),
    },
    uploadForm.value.file!,
  )

  await loadFiles()
  closeUploadModal()
}

const openDeleteModal = (fileId: number) => {
  const file = files.value.find((f) => f.id === fileId)
  if (!file) return
  deleteMessage.value = `Вы уверены, что хотите удалить документ <strong>"${file.name}"</strong>?`
  fileToDeleteId.value = fileId
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteMessage.value = ''
  fileToDeleteId.value = null
}

const handleDelete = async () => {
  if (!fileToDeleteId.value) return

  await fileApi.deleteFile(fileToDeleteId.value)
  await loadFiles()
  closeDeleteModal()
}

const handleDownload = async (file: FileEntity) => {
  const blob = await fileApi.downloadFile(file.id)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

const formatDate = (dateStr: string | Date) => {
  return new Date(dateStr).toLocaleDateString('ru-RU')
}

const formatFileSize = (bytes: number) => filesize(bytes, { locale: 'ru', precision: 2 })
</script>

<style scoped>
.documents-tab {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.documents-header h2 {
  color: #2c3e50;
}

.empty-section {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 8px;
  white-space: nowrap;
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

.form-group input.error {
  border-color: #e74c3c !important;
}

.error-text {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.file-hint {
  display: block;
  margin-top: 4px;
  color: #6c757d;
  font-size: 0.85rem;
}

.selected-file {
  padding: 10px;
  background: #e7f5ff;
  border: 1px solid #a5d8ff;
  border-radius: 4px;
  color: #1864ab;
  margin-top: 10px;
  font-size: 0.9rem;
}

:deep(.data-table td:nth-child(1)) {
  overflow-wrap: break-word;
  white-space: normal;
}
</style>
