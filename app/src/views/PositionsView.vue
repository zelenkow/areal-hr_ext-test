<template>
  <div>
    <h2>Должности</h2>

    <AppButton 
      v-if="!activeMode" 
      variant="create"
      @click="startCreate"
    >
      Добавить должность
    </AppButton>

    <div 
      v-if="activeMode === 'create'" 
      class="create-form"
    >
      <h3>Создать должность</h3>
      <form @submit.prevent="createPosition">
        <div class="form-group">
          <label for="name">Название:</label>
          <input
            id="name"
            v-model="newPosition.name"
            type="text"
            required
          >
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
      v-if="positions.length > 0"
      class="positions-list"
    >
      <h3>Список должностей:</h3>
      <div
        v-for="position in positions"
        :key="position.id"
        class="position-card"
      >
        <div v-if="editingPosition?.id !== position.id">
          <div class="position-header">
            <h4>{{ position.name }}</h4>
          </div>

          <div class="position-actions">
            <AppButton
              variant="edit"
              @click="startEdit(position)"
            >
              Редактировать
            </AppButton>
            <AppButton
              variant="danger"
              @click="openDeleteModal(position)"
            >
              Удалить
            </AppButton>
          </div>
        </div>

        <form
          v-else
          class="edit-form"
          @submit.prevent="updatePosition"
        >
          <h4>Редактировать должность</h4>
          
          <div class="form-group">
            <label for="edit-name">Название:</label>
            <input
              id="edit-name"
              v-model="editFormData.name"
              type="text"
              required
            >
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
      <p>Должности отсутствуют</p>
    </div>

    <DeleteModal
      :show="showDeleteModal"
      entity-name="должность"
      :entity-title="positionToDelete?.name || ''"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script>
import { positionsAPI } from '../services/api'
import AppButton from '../components/AppButton.vue'
import DeleteModal from '../components/DeleteModal.vue'

export default {
  name: 'PositionsView',
  components: {
    AppButton,
    DeleteModal
  },
  data() {
    return {
      newPosition: {
        name: ''
      },
      positions: [],
      editingPosition: null,
      editFormData: { 
        name: ''
      },
      showDeleteModal: false,
      positionToDelete: null,
      activeMode: null,
    }
  },

  async mounted() {
    await this.loadPositions()
  },

  methods: {
    async loadPositions() {
      try {
        const response = await positionsAPI.getAll()
        this.positions = response.data
      } catch (error) {
        console.error('Failed to fetch positions:', error)
      }
    },

    startCreate() {
      this.activeMode = 'create'
      this.showForm = true
      this.newPosition = { 
        name: ''
      }
    },

    async createPosition() {
      try {
        const response = await positionsAPI.create(this.newPosition)
        this.positions.push(response.data)
        this.activeMode = null
        this.showForm = false
        this.newPosition = { 
          name: ''
        }
      } catch (error) {
        console.error('Failed to create position:', error)
      } 
    },

    cancelCreate() {
      this.activeMode = null
      this.showForm = false
      this.newPosition = { 
        name: ''
      }
    },

    startEdit(position) {
      this.activeMode = 'edit'
      this.editingPosition = position
      this.editFormData = {
        name: position.name
      }
    },

    cancelEdit() {
      this.activeMode = null
      this.editingPosition = null
      this.editFormData = { 
        name: ''
      }
    },
    
    async updatePosition() {
      try {
        const response = await positionsAPI.update(
          this.editingPosition.id,
          this.editFormData
        )
    
        const updatedPosition = response.data
        const index = this.positions.findIndex(pos => pos.id === updatedPosition.id)
        this.positions.splice(index, 1, updatedPosition)
    
        this.activeMode = null
        this.cancelEdit()
      } catch (error) {
        console.error('Failed to update position:', error)
      }
    },

    openDeleteModal(position) {
      this.positionToDelete = position
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.positionToDelete = null
    },

    async confirmDelete() {
      try {
        await positionsAPI.delete(this.positionToDelete.id)
        const index = this.positions.findIndex(pos => pos.id === this.positionToDelete.id)
        this.positions.splice(index, 1)
        this.closeDeleteModal()
      } catch (error) {
        console.error('Failed to delete position:', error)
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

.positions-list {
  margin-top: 2rem;
}

.position-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.position-header h4 {
  margin: 0;
  color: #14202b;
}

.position-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>