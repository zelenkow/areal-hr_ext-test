<template>
  <div class="users-container">
    <div class="header">
      <h1>Пользователи</h1>
      <AppButton variant="primary" @click="openCreateModal"> Добавить пользователя </AppButton>
    </div>

    <DataTable v-if="users.length" striped hover>
      <template #headers>
        <th style="width: 15%">Фамилия</th>
        <th style="width: 15%">Имя</th>
        <th style="width: 15%">Отчество</th>
        <th style="width: 10%">Логин</th>
        <th style="width: 15%">Роль</th>
        <th style="width: 8%">Дата создания</th>
        <th style="width: 22%">Действия</th>
      </template>

      <template #rows>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.last_name }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.middle_name }}</td>
          <td>{{ user.login }}</td>
          <td>
            <span class="role-badge" :class="user.role">{{ getRoleLabel(user.role) }}</span>
          </td>
          <td>{{ formatDate(user.created_at) }}</td>
          <td class="actions">
            <AppButton variant="secondary" @click="openEditModal(user)"> Редактировать </AppButton>
            <AppButton
              variant="danger"
              @click="openDeleteModal(user.id, `${user.last_name} ${user.first_name}`)"
            >
              Удалить
            </AppButton>
          </td>
        </tr>
      </template>
    </DataTable>

    <div v-else class="no-data">Нет пользователей для отображения</div>

    <FormModal
      :show="showCreateModal"
      title="Создание пользователя"
      submit-text="Создать"
      @submit="createUser"
      @cancel="closeCreateModal"
    >
      <div class="form-group">
        <label>Фамилия:</label>
        <input
          type="text"
          v-model="newUser.last_name"
          :class="{ error: showLastNameError && !newUser.last_name.trim() }"
          placeholder="Введите фамилию"
        />
        <span v-if="showLastNameError && !newUser.last_name.trim()" class="error-text">
          Фамилия обязательна
        </span>
      </div>
      <div class="form-group">
        <label>Имя:</label>
        <input
          type="text"
          v-model="newUser.first_name"
          :class="{ error: showFirstNameError && !newUser.first_name.trim() }"
          placeholder="Введите имя"
        />
        <span v-if="showFirstNameError && !newUser.first_name.trim()" class="error-text">
          Имя обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Отчество:</label>
        <input
          type="text"
          v-model="newUser.middle_name"
          :class="{ error: showMiddleNameError && !newUser.middle_name.trim() }"
          placeholder="Введите отчество"
        />
        <span v-if="showMiddleNameError && !newUser.middle_name.trim()" class="error-text">
          Отчество обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Логин:</label>
        <input
          type="text"
          v-model="newUser.login"
          :class="{ error: showLoginError && !newUser.login.trim() }"
          placeholder="Введите логин"
        />
        <span v-if="showLoginError && !newUser.login.trim()" class="error-text">
          Логин обязателен
        </span>
      </div>
      <div class="form-group">
        <label>Пароль:</label>
        <input
          type="password"
          v-model="newUser.password_hash"
          :class="{ error: showPasswordError && !newUser.password_hash.trim() }"
          placeholder="Введите пароль"
        />
        <span v-if="showPasswordError && !newUser.password_hash.trim()" class="error-text">
          Пароль обязателен
        </span>
      </div>
      <div class="form-group">
        <label>Роль:</label>
        <select v-model="newUser.role">
          <option value="">Выберите роль</option>
          <option value="admin">Администратор</option>
          <option value="manager">Менеджер</option>
        </select>
        <span v-if="showRoleError && !newUser.role.trim()" class="error-text">
          Роль обязательна
        </span>
      </div>
    </FormModal>

    <FormModal
      :show="showEditModal"
      title="Редактирование пользователя"
      submit-text="Сохранить"
      @submit="updateUser"
      @cancel="closeEditModal"
    >
      <div class="form-group">
        <label>Фамилия:</label>
        <input
          type="text"
          v-model="editingUser.last_name"
          :class="{ error: showEditLastNameError && !editingUser.last_name?.trim() }"
          placeholder="Введите фамилию"
        />
        <span v-if="showEditLastNameError && !editingUser.last_name?.trim()" class="error-text">
          Фамилия обязательна
        </span>
      </div>
      <div class="form-group">
        <label>Имя:</label>
        <input
          type="text"
          v-model="editingUser.first_name"
          :class="{ error: showEditFirstNameError && !editingUser.first_name?.trim() }"
          placeholder="Введите имя"
        />
        <span v-if="showEditFirstNameError && !editingUser.first_name?.trim()" class="error-text">
          Имя обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Отчество:</label>
        <input
          type="text"
          v-model="editingUser.middle_name"
          :class="{ error: showEditMiddleNameError && !editingUser.middle_name?.trim() }"
          placeholder="Введите отчество"
        />
        <span v-if="showEditMiddleNameError && !editingUser.middle_name?.trim()" class="error-text">
          Отчество обязательно
        </span>
      </div>
      <div class="form-group">
        <label>Логин:</label>
        <input
          type="text"
          v-model="editingUser.login"
          :class="{ error: showEditLoginError && !editingUser.login?.trim() }"
          placeholder="Введите логин"
        />
        <span v-if="showEditLoginError && !editingUser.login?.trim()" class="error-text">
          Логин обязателен
        </span>
      </div>
      <div class="form-group">
        <label>Роль:</label>
        <select v-model="editingUser.role">
          <option value="">Выберите роль</option>
          <option value="admin">Администратор</option>
          <option value="manager">Менеджер</option>
        </select>
        <span v-if="showEditRoleError && !editingUser.role?.trim()" class="error-text">
          Роль обязательна
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
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
} from '@/types/user'

import { formatDate } from '@/utils/helpers'

import { userApi } from '@/services/user-api'

import FormModal from '@/components/FormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AppButton from '@/components/AppButton.vue'
import DataTable from '@/components/DataTable.vue'

import { ref, onMounted } from 'vue'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const showLastNameError = ref(false)
const showFirstNameError = ref(false)
const showMiddleNameError = ref(false)
const showLoginError = ref(false)
const showPasswordError = ref(false)
const showRoleError = ref(false)

const showEditLastNameError = ref(false)
const showEditFirstNameError = ref(false)
const showEditMiddleNameError = ref(false)
const showEditLoginError = ref(false)
const showEditRoleError = ref(false)

const users = ref<User[]>([])

const newUser = ref<CreateUserDto>({
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  password_hash: '',
  role: '',
})

const editingUserId = ref<number | null>(null)
const originalUserData = ref<UpdateUserDto>({
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  role: '',
})
const editingUser = ref<UpdateUserDto>({
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  role: '',
})

const userToDelete = ref<number | null>(null)
const deleteMessage = ref('')

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  users.value = await userApi.getUsers()
}

const getRoleLabel = (role: string): string => {
  const roles: Record<string, string> = {
    admin: 'Администратор',
    manager: 'Менеджер',
  }
  return roles[role] as string;
}

const openCreateModal = (): void => {
  resetNewForm()
  showCreateModal.value = true
  showEditModal.value = false
}

const createUser = async () => {
  showLastNameError.value = true
  showFirstNameError.value = true
  showMiddleNameError.value = true
  showLoginError.value = true
  showPasswordError.value = true
  showRoleError.value = true

  if (
    !newUser.value.last_name.trim() ||
    !newUser.value.first_name.trim() ||
    !newUser.value.middle_name.trim() ||
    !newUser.value.login.trim() ||
    !newUser.value.password_hash.trim() ||
    !newUser.value.role.trim()
  ) {
    return
  }

  await userApi.createUser(newUser.value)
  await loadData()
  closeCreateModal()
}

const openEditModal = async (user: User) => {
  editingUserId.value = user.id

  const usrData = await userApi.getUserById(user.id)

  editingUser.value = {
    last_name: usrData.last_name,
    first_name: usrData.first_name,
    middle_name: usrData.middle_name,
    login: usrData.login,
    role: usrData.role,
  }

  originalUserData.value = {
    last_name: usrData.last_name,
    first_name: usrData.first_name,
    middle_name: usrData.middle_name,
    login: usrData.login,
    role: usrData.role,
  }

  showEditModal.value = true
  showCreateModal.value = false
}

const updateUser = async () => {
  showEditLastNameError.value = true
  showEditFirstNameError.value = true
  showEditMiddleNameError.value = true
  showEditLoginError.value = true
  showEditRoleError.value = true

  if (
    !editingUser.value.last_name?.trim() ||
    !editingUser.value.first_name?.trim() ||
    !editingUser.value.login?.trim() ||
    !editingUser.value.role?.trim()
  ) {
    return
  }

  const changes: UpdateUserDto = {}

  if (editingUser.value.last_name?.trim() !== originalUserData.value.last_name) {
    changes.last_name = editingUser.value.last_name
  }

  if (editingUser.value.first_name?.trim() !== originalUserData.value.first_name) {
    changes.first_name = editingUser.value.first_name
  }

  if (editingUser.value.middle_name?.trim() !== originalUserData.value.middle_name) {
    changes.middle_name = editingUser.value.middle_name
  }

  if (editingUser.value.login?.trim() !== originalUserData.value.login) {
    changes.login = editingUser.value.login
  }

  if (editingUser.value.role?.trim() !== originalUserData.value.role) {
    changes.role = editingUser.value.role
  }

  if (Object.keys(changes).length === 0) {
    closeEditModal()
    return
  }

  await userApi.updateUser(editingUserId.value!, changes)
  await loadData()
  closeEditModal()
}

const openDeleteModal = (id: number, name: string) => {
  userToDelete.value = id
  deleteMessage.value = `Вы уверены, что хотите удалить пользователя <strong>"${name}"</strong>?`
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await userApi.deleteUser(userToDelete.value!)
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
  userToDelete.value = 0
  deleteMessage.value = ''
}

const resetNewForm = () => {
  newUser.value = {
    last_name: '',
    first_name: '',
    middle_name: '',
    login: '',
    password_hash: '',
    role: '',
  }
  showLastNameError.value = false
  showFirstNameError.value = false
  showMiddleNameError.value = false
  showLoginError.value = false
  showPasswordError.value = false
  showRoleError.value = false
}

const resetEditForm = () => {
  editingUserId.value = null
  editingUser.value = {
    last_name: '',
    first_name: '',
    middle_name: '',
    login: '',
    role: '',
  }
  showEditLastNameError.value = false
  showEditFirstNameError.value = false
  showEditMiddleNameError.value = true
  showEditLoginError.value = false
  showEditRoleError.value = false
}
</script>

<style scoped>
.users-container {
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

.form-group select {
  background-color: white;
  cursor: pointer;
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
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.form-group select:invalid {
  color: #a0a0a0;
  font-style: italic;
  opacity: 0.8;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.role-badge.admin {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.role-badge.manager {
  background-color: #fff3e0;
  color: #ef6c00;
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
}
</style>
