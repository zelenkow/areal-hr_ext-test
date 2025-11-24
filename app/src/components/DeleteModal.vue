<template>
  <div
    v-if="show"
    class="modal-overlay"
  >
    <div class="modal-content">
      <p>
        Вы уверены, что хотите удалить {{ entityName }}? 
      </p>
      <p class="entity-name">
        "{{ entityTitle }}"
      </p>
    
      <div class="modal-actions">
        <AppButton
          variant="danger"
          @click="$emit('confirm')"
        >
          Удалить
        </AppButton>
        <AppButton
          variant="secondary"
          @click="$emit('cancel')"
        >
          Отмена
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from './AppButton.vue'

export default {
  name: 'DeleteModal',
  components: {
    AppButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    entityName: {
      type: String,
      required: true
    },
    entityTitle: {
      type: String,
      required: true
    }
  },
  emits: ['confirm', 'cancel']
}
</script>

<style scoped>
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
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.entity-name {
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  margin: 1rem 0;
  color: #2c3e50;
}
</style>