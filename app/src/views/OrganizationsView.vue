<template>
  <div>
    <h2>Организации</h2>

    <button
      v-if="!showForm"
      class="btn-create"
      @click="showForm = true"
    >
      Добавить организацию
    </button>

    <div
      v-if="showForm"
      class="create-form"
    >
      <h3>Создать организацию</h3>
      <form @submit.prevent="createOrganization">
        <div class="form-group">
          <label for="name">Название:</label>
          <input
            id="name"
            v-model="newOrganization.name"
            type="text"
            required
          >
        </div>

        <div class="form-group">
          <label for="comment">Комментарий:</label>
          <textarea
            id="comment"
            v-model="newOrganization.comment"
            style="resize: vertical;" 
            rows="3"
          />
        </div>

        <button
          type="submit"
          class="btn-primary"
        >
          Создать
        </button>
        <button
          type="button"
          class="btn-secondary"
          @click="cancelCreate"
        >
          Отмена
        </button>
      </form>
    </div>

    <div
      v-if="organizations.length > 0"
      class="organizations-list"
    >
      <h3>Список организаций:</h3>
      <div
        v-for="org in organizations"
        :key="org.id"
        class="organization-card"
      >
        <div v-if="editingOrganization?.id !== org.id">
          <div class="org-header">
            <h4>{{ org.name }}</h4>
          </div>

          <p
            v-if="org.comment"
            class="org-comment"
          >
            {{ org.comment }}
          </p>

          <div class="org-actions">
            <button
              class="btn-edit"
              @click="startEdit(org)"
            >
              Редактировать
            </button>
            <button
              class="btn-delete"
              @click="openDeleteModal(org)"
            >
              Удалить
            </button>
          </div>
        </div>

        <form
          v-else
          class="edit-form"
          @submit.prevent="updateOrganization"
        >
          <h4>Редактировать организацию</h4>
          
          <div class="form-group">
            <label for="edit-name">Название:</label>
            <input
              id="edit-name"
              v-model="editFormData.name"
              type="text"
              required
            >
          </div>

          <div class="form-group">
            <label for="edit-comment">Комментарий:</label>
            <textarea
              id="edit-comment"
              v-model="editFormData.comment"
              style="resize: vertical;"
              rows="3"
            />
          </div>

          <div class="edit-actions">
            <button
              type="submit"
              class="btn-primary"
            >
              Сохранить
            </button>
            <button
              class="btn-secondary"
              @click="cancelEdit"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else>
      <p>Организации отсутствуют</p>
    </div>

    <div
      v-if="showDeleteModal"
      class="modal-overlay"
    >
      <div class="modal-content">
        <p>
          Вы уверены, что хотите удалить организацию? 
        </p><p class="org-name">
          "{{ organizationToDelete?.name }}"
        </p>
    
        <div class="modal-actions">
          <button
            class="btn-delete"
            @click="confirmDelete"
          >
            Удалить
          </button>
          <button
            class="btn-secondary"
            @click="closeDeleteModal"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { organizationsAPI } from '../services/api'

export default {
  data() {
    return {
      showForm: false,
      newOrganization: {name: '', comment: '',},
      organizations: [],
      editingOrganization: null,
      editFormData: { name: '', comment: '' },
      showDeleteModal: false,
      organizationToDelete: null,
    }
  },

  async mounted() {
    await this.loadOrganizations()
  },

  methods: {

    async loadOrganizations() {
      try {
        const response = await organizationsAPI.getAll()
        this.organizations = response.data
      } catch (error) {
        console.error('Failed to fetch organizations:', error)
      }
    },

    async createOrganization() {

      try {
        const response = await organizationsAPI.create(this.newOrganization)
        this.organizations.push(response.data)
        this.showForm = false
        this.newOrganization = { name: '', comment: '' }
      } catch (error) {
        console.error('Filed to create organization:', error)
      } 
    },

    cancelCreate() {
      console.log('Cancel create')
      this.showForm = false
      this.newOrganization = { name: '', comment: '' }
    },

    startEdit(organization) {
      this.editingOrganization = organization
      this.editFormData = {
        name: organization.name,
        comment: organization.comment || ''
      }
    },

    cancelEdit() {
      this.editingOrganization = null
      this.editFormData = { name: '', comment: '' }
    },
    
    async updateOrganization() {
      try {
        const response = await organizationsAPI.update(
          this.editingOrganization.id,
          this.editFormData
        )
    
        const updatedOrg = response.data
        const index = this.organizations.findIndex(org => org.id === updatedOrg.id)
        this.organizations.splice(index, 1, updatedOrg)
    
        this.cancelEdit()
      }     catch (error) {
        console.error('Failed to update organization:', error)
      }
    },

    openDeleteModal(organization) {
      this.organizationToDelete = organization
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.organizationToDelete = null
    },

    async confirmDelete() {
      try {
        await organizationsAPI.delete(this.organizationToDelete.id)
        const index = this.organizations.findIndex(org => org.id === this.organizationToDelete.id)
        this.organizations.splice(index, 1)
        this.closeDeleteModal()
      } catch (error) {
        console.error('Failed to delete organization:', error)
      }
    }   
  }
}

</script>

<style scoped>

.btn-create {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.edit-form h4,
.create-form h3 {
  margin-top: -0.5rem;
  margin-bottom: 2.5rem;

}

.edit-form,
.create-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  border: 1px solid #e9ecef;
}

.edit-form .form-group,
.create-form .form-group {
  margin-bottom: 1rem;
}

.edit-form .form-group label,
.create-form .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c2d50;
}

.edit-form .form-group input,
.create-form .form-group input,
.edit-form .form-group textarea,
.create-form .form-group textarea {
  padding: 0.5rem;
  font-size: 0.9rem;
  width: 100%;
}

.modal-actions .btn-delete,
.edit-form .btn-primary,
.create-form .btn-primary {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions .btn-secondary,
.edit-form .btn-secondary, 
.create-form .btn-secondary {
  margin-left: 0.5rem;
  border: none;
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.organizations-list {
  margin-top: 2rem;
}

.organization-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.org-header h4 {
  margin: 0;
  color: #14202b;
}

.org-comment {
  font-size: 0.9rem;
  color: #5d6d7e;
}

.org-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-edit {
  background: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  padding: 0.5rem 0.5rem;
}

.modal-actions .btn-delete,
.btn-delete {
  background: #e74c3c;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  padding: 0.5rem 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.org-name {
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  margin: 1rem 0;
  color: #2c3e50;
}

</style>