<template>
  <div>
    <h2>Отделы</h2>

    <AppButton 
      v-if="!activeMode" 
      variant="create"
      @click="startCreate"
    >
      Добавить отдел
    </AppButton>

    <div 
      v-if="activeMode === 'create'" 
      class="create-form"
    >
      <h3>Создать отдел</h3>
      <form @submit.prevent="createDepartment">
        <div class="form-group">
          <label for="name">Название:</label>
          <input
            id="name"
            v-model="newDepartment.name"
            type="text"
            required
          >
        </div>

        <div class="form-group">
          <label for="organization">Организация:</label>
          <select
            id="organization"
            v-model="newDepartment.organization_id"
            required
          >
            <option value="">
              Выберите организацию
            </option>
            <option 
              v-for="org in organizations" 
              :key="org.id" 
              :value="org.id"
            >
              {{ org.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="parent">Родительский отдел:</label>
          <select
            id="parent"
            v-model="newDepartment.parent_id"
          >
            <option :value="null">
              Нет родительского отдела
            </option>
            <option 
              v-for="dept in filteredDepartments" 
              :key="dept.id" 
              :value="dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="comment">Комментарий:</label>
          <textarea
            id="comment"
            v-model="newDepartment.comment"
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
      v-if="departments.length > 0"
      class="departments-list"
    >
      <h3>Список отделов:</h3>
      <div
        v-for="dept in departments"
        :key="dept.id"
        class="department-card"
      >
        <div v-if="editingDepartment?.id !== dept.id">
          <div class="dept-header">
            <h4>{{ dept.name }}</h4>
          </div>

          <div class="dept-info">
            <p><strong>Организация:</strong> {{ getOrganizationName(dept.organization_id) }}</p>
            <p v-if="dept.parent_id">
              <strong>Родительский отдел:</strong> {{ getParentDepartmentName(dept.parent_id) }}
            </p>
          </div>

          <p
            v-if="dept.comment"
            class="dept-comment"
          >
            {{ dept.comment }}
          </p>

          <div class="dept-actions">
            <AppButton
              variant="edit"
              @click="startEdit(dept)"
            >
              Редактировать
            </AppButton>
            <AppButton
              variant="danger"
              @click="openDeleteModal(dept)"
            >
              Удалить
            </AppButton>
          </div>
        </div>

        <form
          v-else
          class="edit-form"
          @submit.prevent="updateDepartment"
        >
          <h4>Редактировать отдел</h4>
          
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
      <p>Отделы отсутствуют</p>
    </div>

    <DeleteModal
      :show="showDeleteModal"
      entity-name="отдел"
      :entity-title="departmentToDelete?.name || ''"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script>
import { departmentsAPI, organizationsAPI } from '../services/api'
import AppButton from '../components/AppButton.vue'
import DeleteModal from '../components/DeleteModal.vue'

export default {
  name: 'DepartmentsView',
  components: {
    AppButton,
    DeleteModal
  },
  data() {
    return {
      newDepartment: {
        name: '', 
        organization_id: null,
        parent_id: null,
        comment: ''
      },
      departments: [],
      organizations: [],
      editingDepartment: null,
      editFormData: { 
        name: '', 
        comment: '' 
      },
      showDeleteModal: false,
      departmentToDelete: null,
      activeMode: null,
    }
  },

  computed: {
    filteredDepartments() {
      return this.departments.filter(dept => 
        dept.id !== this.editingDepartment?.id && 
        !this.isChildDepartment(dept, this.editingDepartment)
      )
    }
  },

  async mounted() {
    await this.loadDepartments()
    await this.loadOrganizations()
  },

  methods: {
    async loadDepartments() {
      try {
        const response = await departmentsAPI.getAll()
        this.departments = response.data
      } catch (error) {
        console.error('Failed to fetch departments:', error)
      }
    },

    async loadOrganizations() {
      try {
        const response = await organizationsAPI.getAll()
        this.organizations = response.data
      } catch (error) {
        console.error('Failed to fetch organizations:', error)
      }
    },

    getOrganizationName(orgId) {
      const org = this.organizations.find(o => o.id === orgId)
      return org.name
    },

    getParentDepartmentName(parentId) {
      const dept = this.departments.find(d => d.id === parentId)
      return dept.name
    },

    isChildDepartment(department, parentDepartment) {
      if (!parentDepartment) return false
      
      let current = department
      while (current && current.parent_id) {
        if (current.parent_id === parentDepartment.id) {
          return true
        }
        current = this.departments.find(d => d.id === current.parent_id)
      }
      return false
    },

    startCreate() {
      this.activeMode = 'create'
      this.showForm = true
      this.newDepartment = { 
        name: '', 
        organization_id: null,
        parent_id: null,
        comment: '' 
      }
    },

    async createDepartment() {
      try {
        const response = await departmentsAPI.create(this.newDepartment)
        this.departments.push(response.data)
        this.activeMode = null
        this.showForm = false
        this.newDepartment = { 
          name: '', 
          organization_id: null,
          parent_id: null,
          comment: '' 
        }
      } catch (error) {
        console.error('Failed to create department:', error)
      } 
    },

    cancelCreate() {
      this.activeMode = null
      this.showForm = false
      this.newDepartment = { 
        name: '', 
        organization_id: null,
        parent_id: null,
        comment: '' 
      }
    },

    startEdit(department) {
      this.activeMode = 'edit'
      this.editingDepartment = department
      this.editFormData = {
        name: department.name,
        comment: department.comment || ''
      }
    },

    cancelEdit() {
      this.activeMode = null
      this.editingDepartment = null
      this.editFormData = { 
        name: '', 
        comment: '' 
      }
    },
    
    async updateDepartment() {
      try {
        const response = await departmentsAPI.update(
          this.editingDepartment.id,
          this.editFormData
        )
    
        const updatedDept = response.data
        const index = this.departments.findIndex(dept => dept.id === updatedDept.id)
        this.departments.splice(index, 1, updatedDept)
    
        this.activeMode = null
        this.cancelEdit()
      } catch (error) {
        console.error('Failed to update department:', error)
      }
    },

    openDeleteModal(department) {
      this.departmentToDelete = department
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.departmentToDelete = null
    },

    async confirmDelete() {
      try {
        await departmentsAPI.delete(this.departmentToDelete.id)
        const index = this.departments.findIndex(dept => dept.id === this.departmentToDelete.id)
        this.departments.splice(index, 1)
        this.closeDeleteModal()
      } catch (error) {
        console.error('Failed to delete department:', error)
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
.edit-form .form-group select,
.create-form .form-group select,
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

.departments-list {
  margin-top: 2rem;
}

.department-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.dept-header h4 {
  margin: 0;
  color: #14202b;
}

.dept-info {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.dept-info p {
  margin: 0.25rem 0;
}

.dept-comment {
  font-size: 0.9rem;
  color: #5d6d7e;
  margin-top: 0.5rem;
}

.dept-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>