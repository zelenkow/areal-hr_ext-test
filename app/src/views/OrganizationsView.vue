<template>
  <div>
    <h2>Организации</h2>

    <AppButton 
      v-if="!activeMode" 
      variant="create"
      @click="startCreate"
    >
      Добавить организацию
    </AppButton>

    <div 
      v-if="activeMode === 'create'" 
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

        <div class="form-actions">
          <AppButton
            type="submit"
            variant="primary"
          >
            Создать
          </AppButton>
          <AppButton
            type="button"
            variant="secondary"
            @click="cancelCreate"
          >
            Отмена
          </AppButton>
        </div>
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
            <AppButton
              variant="edit"
              @click="startEdit(org)"
            >
              Редактировать
            </AppButton>
            <AppButton
              variant="danger"
              @click="openDeleteModal(org)"
            >
              Удалить
            </AppButton>
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

          <div class="form-actions">
            <AppButton
              type="submit"
              variant="primary"
            >
              Сохранить
            </AppButton>
            <AppButton
              type="button"
              variant="secondary"
              @click="cancelEdit"
            >
              Отмена
            </AppButton>
          </div>
        </form>
      </div>
    </div>

    <div v-else>
      <p>Организации отсутствуют</p>
    </div>

    <DeleteModal
      :show="showDeleteModal"
      entity-name="организацию"
      :entity-title="organizationToDelete?.name || ''"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script>
import { organizationsAPI } from '../services/api'
import AppButton from '../components/AppButton.vue'
import DeleteModal from '../components/DeleteModal.vue'

export default {
  name: 'OrganizationsView',
  components: {
    AppButton,
    DeleteModal
  },
  data() {
    return {
      newOrganization: {name: '', comment: '',},
      organizations: [],
      editingOrganization: null,
      editFormData: { name: '', comment: '' },
      showDeleteModal: false,
      organizationToDelete: null,
      activeMode: null,
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

    startCreate() {
      this.activeMode = 'create'
      this.showForm = true
      this.newOrganization = { name: '', comment: '' }
    },

    async createOrganization() {
      try {
        const response = await organizationsAPI.create(this.newOrganization)
        this.organizations.push(response.data)
        this.activeMode = null
        this.showForm = false
        this.newOrganization = { name: '', comment: '' }
      } catch (error) {
        console.error('Failed to create organization:', error)
      } 
    },

    cancelCreate() {
      this.activeMode = null
      this.showForm = false
      this.newOrganization = { name: '', comment: '' }
    },

    startEdit(organization) {
      this.activeMode = 'edit'
      this.editingOrganization = organization
      this.editFormData = {
        name: organization.name,
        comment: organization.comment || ''
      }
    },

    cancelEdit() {
      this.activeMode = null
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
    
        this.activeMode = null
        this.cancelEdit()
      } catch (error) {
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
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
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
</style>